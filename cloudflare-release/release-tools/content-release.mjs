import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import {validContent} from '../portfolio-cms/worker.mjs';

export const ROOT=fileURLToPath(new URL('../',import.meta.url));
export const CONTENT_URL='https://huzaifa-alahmad.pages.dev/api/cms/content';
const pdfPaths=['assets/personal/Huzaifa-Alahmad-CV.pdf','assets/personal/Huzaifa-Alahmad-Master-CV.pdf'];
export const digest=value=>createHash('sha256').update(value).digest('hex');
const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):value;
export const contentHash=content=>digest(JSON.stringify(stable(content)));
const json=async file=>JSON.parse(await readFile(file,'utf8'));

export function validateEnvelope(value){
 if(!value||!Number.isSafeInteger(value.revision)||value.revision<1||!validContent(value.content))throw Error('The public CMS response is invalid; nothing was changed.');
 if(typeof value.updatedAt!=='string'||!Number.isFinite(Date.parse(value.updatedAt)))throw Error('Missing valid CMS update time.');
 return value;
}

export async function fetchSnapshot(fetcher=fetch){
 // Public, fixed destination. No session, token, cookie or private API is used.
 const r=await fetcher(CONTENT_URL,{redirect:'manual',headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
 if(r.status!==200||!r.headers.get('content-type')?.includes('application/json'))throw Error('CMS fetch did not return 200 JSON; redirects and login pages are rejected.');
 const body=await r.text();if(Buffer.byteLength(body)>1000000)throw Error('CMS response exceeds the content size limit.');
 return validateEnvelope(JSON.parse(body));
}

export function changedPaths(before,after,prefix=''){
 if(JSON.stringify(before)===JSON.stringify(after))return [];
 if(!before||!after||typeof before!=='object'||typeof after!=='object')return [prefix||'content'];
 return [...new Set([...Object.keys(before),...Object.keys(after)])].flatMap(k=>changedPaths(before[k],after[k],prefix?prefix+'.'+k:k));
}

export function masterDraft(c){
 const lines=['# '+c.site.name.en,'',c.site.role.en,'',c.site.location.en,'',c.contact.email+' | '+c.contact.phoneDisplay,'',
  'Portfolio: https://huzaifa-alahmad.pages.dev/','',c.site.about.en,'','## Experience',''];
 for(const j of c.jobs)lines.push('### '+j.company+' | '+j.role.en,'',j.dates.en+' | '+j.location.en,'',...j.bullets.map(b=>'- '+b.en),'');
 lines.push('## Education','',c.site.education.en,'','## Projects','');
 for(const p of c.projects){lines.push('### '+p.name,'',p.status.en,'',p.desc.en,'');if(p.repositoryUrl||p.url)lines.push(p.repositoryUrl||p.url,'');}
 lines.push('## Learning and recognition','');
 for(const c0 of c.certificates)lines.push('- '+c0.title+' | '+c0.kind.en+' | '+new URL(c0.url,'https://huzaifa-alahmad.pages.dev/').href);
 lines.push('','This is a generated English source draft. Review the PDF layout and any tailored application copy before publication.');
 return lines.join('\n')+'\n';
}

export async function verifyRelease(root=ROOT){
 const c=await json(path.join(root,'huzaifa-portfolio-frontend/src/data/personalProfile.json'));
 const seed=await json(path.join(root,'portfolio-cms/seed.json'));
 const review=await json(path.join(root,'release-tools/reviewed-release.json'));
 if(!validContent(c)||contentHash(c)!==contentHash(seed))throw Error('Frontend and CMS seed differ or are invalid. Review and synchronize them before building.');
 if(contentHash(c)!==review.contentSha256)throw Error('Content changed after CV review. Regenerate/review both CVs and record their matching content hash before building.');
 for(const rel of pdfPaths){const actual=digest(await readFile(path.join(root,'huzaifa-portfolio-frontend/public',rel)));if(actual!==review.pdfSha256[rel])throw Error('A CV PDF differs from the reviewed release: '+rel);}
 return {contentSha256:contentHash(c),reviewedRevision:review.cmsRevision,counts:{jobs:c.jobs.length,projects:c.projects.length,learning:c.certificates.length},pdfs:pdfPaths.length};
}

export async function checkLive(root=ROOT,fetcher=fetch){
 const local=await verifyRelease(root),live=await fetchSnapshot(fetcher);
 const localContent=await json(path.join(root,'huzaifa-portfolio-frontend/src/data/personalProfile.json'));
 const differences=changedPaths(localContent,live.content);
 return {...local,liveRevision:live.revision,liveContentSha256:contentHash(live.content),inSync:local.contentSha256===contentHash(live.content),changedPaths:differences};
}

export async function prepareCandidate(root=ROOT,fetcher=fetch){
 const live=await fetchSnapshot(fetcher);
 const local=await json(path.join(root,'huzaifa-portfolio-frontend/src/data/personalProfile.json'));
 const hash=contentHash(live.content);
 const target=path.join(root,'.release','candidate-r'+live.revision+'-'+hash.slice(0,12));
 await mkdir(target,{recursive:true});
 const report={cmsRevision:live.revision,updatedAt:live.updatedAt,contentSha256:hash,changedPaths:changedPaths(local,live.content),counts:{jobs:live.content.jobs.length,projects:live.content.projects.length,learning:live.content.certificates.length},activeFilesChanged:false,remoteChanges:false};
 await writeFile(path.join(target,'content.json'),JSON.stringify(live.content,null,2)+'\n');
 await writeFile(path.join(target,'MASTER_CV_SOURCE.md'),masterDraft(live.content));
 await writeFile(path.join(target,'review.json'),JSON.stringify(report,null,2)+'\n');
 return {...report,candidateDirectory:target};
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 try{
  const command=process.argv[2]||'verify';
  const result=command==='verify'?await verifyRelease():command==='check-live'?await checkLive():command==='prepare'?await prepareCandidate():null;
  if(!result)throw Error('Use verify, check-live or prepare. No command deploys, changes D1 or overwrites active content.');
  console.log(JSON.stringify(result,null,2));if(command==='check-live'&&!result.inSync)process.exitCode=1;
 }catch(e){console.error(e.message);process.exitCode=1;}
}
