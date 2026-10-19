import {build} from 'vite';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';
import {verifyRelease} from '../release-tools/content-release.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
process.chdir(here);
await verifyRelease(path.dirname(here));
const origin='https://huzaifa-alahmad.pages.dev';
const profile=JSON.parse(await readFile('src/data/personalProfile.json','utf8'));
await build();
await build({build:{ssr:'src/seo/prerender.tsx',outDir:'.seo-build',emptyOutDir:true}});
try {
 const {render}=await import(pathToFileURL(path.join(here,'.seo-build/prerender.js')).href);
 let html=await readFile('dist/index.html','utf8');
 const shell=html.replace(/<title>.*?<\/title>/,'<title>Website administration | Huzaifa Alahmad</title>')
  .replace(/<meta name="robots"[^>]*>/g,'')
  .replace('</head>','<meta name="robots" content="noindex, nofollow" /></head>');
 await writeFile('dist/cms-shell.html',shell);
 const person={'@type':'Person','@id':origin+'/#person',name:profile.site.name.en,alternateName:profile.site.name.ar,
  url:origin+'/',image:new URL(profile.site.portrait,origin).href,jobTitle:'Creative Marketing Specialist',
  description:profile.site.about.en,homeLocation:{'@type':'Place',name:'Dubai, United Arab Emirates'},
  alumniOf:{'@type':'CollegeOrUniversity',name:'University of Aleppo'},
  knowsAbout:['Graphic design','Brand identity','Video production','Social media marketing','AI workflows','Web development'],
  sameAs:[profile.site.linkedin,profile.site.behance,profile.site.github,profile.site.instagram]};
 const graph={'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Huzaifa Alahmad',inLanguage:['en','ar'],publisher:{'@id':person['@id']}},
  {'@type':'ProfilePage','@id':origin+'/#profile',url:origin+'/',name:'Huzaifa Alahmad | Creative Marketing & Visual Design',
   inLanguage:'en',isPartOf:{'@id':origin+'/#website'},mainEntity:{'@id':person['@id']}},person]};
 const structured=JSON.stringify(graph).replace(/</g,'\\u003c');
 html=html.replace('<div id="root"></div>',()=>'<div id="root">'+render()+'</div>')
  .replace('</head>',()=>'<script type="application/ld+json">'+structured+'</script>\n</head>');
 await writeFile('dist/index.html',html);
 await writeFile('dist/404.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Huzaifa Alahmad</title><style>body{font:18px system-ui;background:#101918;color:#f4f1e8;min-height:90vh;display:grid;place-content:center;padding:24px}a{color:#c7ddbd}h1{font-size:clamp(2rem,8vw,4rem)}</style></head><body><main><p>404</p><h1>This page could not be found.</h1><p><a href="/">Return to Huzaifa Alahmad’s portfolio →</a></p></main></body></html>`);
 const allJobsRendered=profile.jobs.every(job=>html.includes(job.company.replaceAll('&','&amp;')));
 if(!html.includes('<h1')||!allJobsRendered)throw Error('Incomplete pre-rendered portfolio');
 console.log('SEO build: complete visible portfolio, structured data, private CMS shell and real 404 page.');
} finally {
 const temporary=path.resolve(here,'.seo-build');
 if(path.dirname(temporary)!==here||path.basename(temporary)!=='.seo-build')throw Error('Unexpected temporary build path');
 await rm(temporary,{recursive:true,force:true});
}
