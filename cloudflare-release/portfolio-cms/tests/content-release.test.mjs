import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {verifyRelease,contentHash,digest,fetchSnapshot,checkLive,prepareCandidate,masterDraft,changedPaths} from '../../release-tools/content-release.mjs';
const seed=JSON.parse(await readFile(new URL('../seed.json',import.meta.url),'utf8'));
const envelope=content=>({content,revision:4,updatedAt:'2026-10-19T09:00:00Z'});
const goodFetch=async()=>Response.json(envelope(seed));

async function fixture(){
 const root=await mkdtemp(path.join(tmpdir(),'presence-release-'));
 for(const dir of ['release-tools','portfolio-cms','huzaifa-portfolio-frontend/src/data','huzaifa-portfolio-frontend/public/assets/personal'])await mkdir(path.join(root,dir),{recursive:true});
 const review={cmsRevision:4,contentSha256:contentHash(seed),pdfSha256:{}};
 for(const name of ['CV','Master-CV']){const rel='assets/personal/Huzaifa-Alahmad-'+name+'.pdf';await writeFile(path.join(root,'huzaifa-portfolio-frontend/public',rel),'reviewed '+name);review.pdfSha256[rel]=digest('reviewed '+name);}
 await writeFile(path.join(root,'release-tools/reviewed-release.json'),JSON.stringify(review));
 await writeFile(path.join(root,'portfolio-cms/seed.json'),JSON.stringify(seed));
 await writeFile(path.join(root,'huzaifa-portfolio-frontend/src/data/personalProfile.json'),JSON.stringify(seed));
 return root;
}

test('release gate catches changed content and PDFs, without depending on JSON key order',async()=>{
 const root=await fixture();try{
  assert.equal((await verifyRelease(root)).pdfs,2);
  assert.equal(contentHash({a:1,b:[2,3]}),contentHash({b:[2,3],a:1}));
  const edited=structuredClone(seed);edited.jobs[0].bullets[0].en+=' Revised.';
  for(const rel of ['portfolio-cms/seed.json','huzaifa-portfolio-frontend/src/data/personalProfile.json'])await writeFile(path.join(root,rel),JSON.stringify(edited));
  await assert.rejects(verifyRelease(root),/Content changed after CV review/);
  for(const rel of ['portfolio-cms/seed.json','huzaifa-portfolio-frontend/src/data/personalProfile.json'])await writeFile(path.join(root,rel),JSON.stringify(seed));
  await writeFile(path.join(root,'huzaifa-portfolio-frontend/public/assets/personal/Huzaifa-Alahmad-CV.pdf'),'unreviewed replacement');
  await assert.rejects(verifyRelease(root),/CV PDF differs/);
 }finally{await rm(root,{recursive:true,force:true});}
});

test('public snapshot rejects redirects, non-JSON, oversized payloads and unsafe content',async()=>{
 await assert.rejects(fetchSnapshot(async()=>new Response('',{status:302})),/200 JSON/);
 await assert.rejects(fetchSnapshot(async()=>new Response('<html>Login</html>')),/200 JSON/);
 await assert.rejects(fetchSnapshot(async()=>Response.json({x:'x'.repeat(1000001)})),/size limit/);
 const invalid=structuredClone(seed);invalid.site.cvUrl='javascript:alert(1)';
 await assert.rejects(fetchSnapshot(async()=>Response.json(envelope(invalid))),/invalid/);
 await fetchSnapshot(async(url,options)=>{assert.equal(options.redirect,'manual');assert.equal(options.headers.Cookie,undefined);assert.equal(url,'https://huzaifa-alahmad.pages.dev/api/cms/content');return goodFetch();});
});

test('candidate retains all records and never replaces active files; later CMS changes fail live check',async()=>{
 const root=await fixture();try{
  const before=await readFile(path.join(root,'portfolio-cms/seed.json'),'utf8');
  const report=await prepareCandidate(root,goodFetch);
  assert.equal(report.activeFilesChanged,false);assert.deepEqual(report.counts,{jobs:5,projects:7,learning:24});
  const draft=await readFile(path.join(report.candidateDirectory,'MASTER_CV_SOURCE.md'),'utf8');
  for(const j of seed.jobs)assert.ok(draft.includes(j.company));
  for(const p of seed.projects)assert.ok(draft.includes(p.name));
  for(const c of seed.certificates)assert.ok(draft.includes(c.title));
  assert.equal(before,await readFile(path.join(root,'portfolio-cms/seed.json'),'utf8'));
  assert.equal((await checkLive(root,goodFetch)).inSync,true);
  const changed=structuredClone(seed);changed.projects.pop();
  const state=await checkLive(root,async()=>Response.json(envelope(changed)));
  assert.equal(state.inSync,false);assert.ok(state.changedPaths.some(x=>x.startsWith('projects.')));
  assert.ok(masterDraft(seed).includes(seed.site.education.en));assert.deepEqual(changedPaths('a','b'),['content']);
 }finally{await rm(root,{recursive:true,force:true});}
});
