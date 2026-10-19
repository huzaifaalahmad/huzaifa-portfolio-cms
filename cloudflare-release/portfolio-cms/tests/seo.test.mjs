import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../worker.mjs';
const origin='https://huzaifa-alahmad.pages.dev';
const front=new URL('../../huzaifa-portfolio-frontend/',import.meta.url);
test('published HTML exposes the same complete portfolio without JavaScript',async()=>{
 const html=await readFile(new URL('dist/index.html',front),'utf8');
 const seed=JSON.parse(await readFile(new URL('src/data/personalProfile.json',front),'utf8'));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const job of seed.jobs)assert.ok(html.includes(job.company.replaceAll('&','&amp;')));
 for(const project of seed.projects)assert.ok(html.includes(project.name));
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(graph['@graph'].find(x=>x['@type']==='ProfilePage').mainEntity['@id'],origin+'/#person');
 const person=graph['@graph'].find(x=>x['@type']==='Person');
 assert.equal(person.name,seed.site.name.en);assert.ok(person.sameAs.includes(seed.site.linkedin));
 assert.ok(html.includes('rel="canonical" href="'+origin+'/"'));
 assert.ok(!html.includes('eng-huzaifa-portfolio.vercel.app'));
 assert.ok(html.includes('portrait.webp'));
 const shell=await readFile(new URL('dist/cms-shell.html',front),'utf8');
 assert.ok(shell.includes('content="noindex, nofollow"'));assert.ok(!shell.includes('<h1'));
 const missing=await readFile(new URL('dist/404.html',front),'utf8');assert.ok(missing.includes('noindex'));
});
test('server redirects consolidated public sections and keeps administration out of search',async()=>{
 let requested;
 const env={ASSETS:{fetch:async req=>{requested=new URL(req.url).pathname;return new Response('shell',{headers:{'Content-Type':'text/html'}})}}};
 for(const path of ['/cms','/cms/','/cms-preview','/dashboard-preview','/cms-shell.html']){
  const r=await worker.fetch(new Request(origin+path),env);assert.equal(r.status,200);
  assert.equal(requested,'/cms-shell');assert.equal(r.headers.get('X-Robots-Tag'),'noindex, nofollow');assert.equal(r.headers.get('Cache-Control'),'no-store');
 }
 for(const [path,dest] of [['/projects','/#projects'],['/contact','/#contact'],['/about','/#about'],['/index.html','/'],['/admin/login','/cms']]){
  const r=await worker.fetch(new Request(origin+path),env);assert.equal(r.status,308);assert.equal(r.headers.get('Location'),dest);
 }
});
test('the previous Worker homepage points to Pages while owner administration stays local',async()=>{
 const env={PUBLIC_SITE_ORIGIN:origin,ASSETS:{fetch:async()=>new Response('owner shell',{headers:{'Content-Type':'text/html'}})}};
 const previous='https://huzaifa-portfolio.huzaifaalahmad23.workers.dev';
 const home=await worker.fetch(new Request(previous+'/'),env);assert.equal(home.status,308);assert.equal(home.headers.get('Location'),origin+'/');
 const contact=await worker.fetch(new Request(previous+'/contact'),env);assert.equal(contact.headers.get('Location'),origin+'/#contact');
 const cms=await worker.fetch(new Request(previous+'/cms'),env);assert.equal(cms.status,200);assert.equal(await cms.text(),'owner shell');
 const missingApi=await worker.fetch(new Request(previous+'/api/missing'),env);assert.equal(missingApi.status,404);
});
