import {test} from 'node:test';
import assert from 'node:assert/strict';
import pages from '../pages-public-worker.mjs';
const CMS_ORIGIN='https://huzaifa-portfolio.huzaifaalahmad23.workers.dev';
const origin='https://huzaifa-alahmad.pages.dev';
test('public Pages endpoint forwards only public content and never browser credentials',async()=>{
 let observed;
 const env={CONTENT_SERVICE:{fetch:async(url,options)=>{observed={url,options};return Response.json({content:{site:{name:{en:'Huzaifa Alahmad'}}}})}}};
  const response=await pages.fetch(new Request(origin+'/api/cms/content',{headers:{Cookie:'private-session',Authorization:'private-credential'}}),env);
  assert.equal(response.status,200);assert.equal(observed.url,CMS_ORIGIN+'/api/cms/content');
  assert.equal(observed.options.headers.Cookie,undefined);assert.equal(observed.options.headers.Authorization,undefined);
  assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow');
  assert.equal((await pages.fetch(new Request(origin+'/api/cms/content',{method:'PUT',body:'{}'}),{})).status,404);
});
test('owner pages stay on the established secure CMS; public assets remain static',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('static asset')}};
 for(const path of ['/cms','/admin/login','/dashboard-preview']){
  const response=await pages.fetch(new Request(origin+path),env);assert.equal(response.status,302);assert.equal(response.headers.get('Location'),CMS_ORIGIN+'/cms');
 }
 const preview=await pages.fetch(new Request(origin+'/cms-preview'),env);assert.equal(preview.headers.get('Location'),CMS_ORIGIN+'/cms-preview');
 assert.equal(await(await pages.fetch(new Request(origin+'/'),env)).text(),'static asset');
});
