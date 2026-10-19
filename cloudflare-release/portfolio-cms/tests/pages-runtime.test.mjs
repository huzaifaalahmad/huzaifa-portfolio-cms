import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {readFile} from 'node:fs/promises';

test('Pages content proxy runs inside the actual Workers runtime',async()=>{
 const mf=new Miniflare(convertV4MiniflareOptions({workers:[
  {name:'pages',modules:true,script:await readFile(new URL('../pages-public-worker.mjs',import.meta.url),'utf8'),compatibilityDate:'2026-10-19',serviceBindings:{CONTENT_SERVICE:'content'}},
  {name:'content',modules:true,compatibilityDate:'2026-10-19',script:`export default {fetch(request){ if(request.headers.has('Cookie')||request.headers.has('Authorization'))return new Response('Credentials forwarded',{status:500});return Response.json({revision:4,content:{name:'public'}})}}`}
 ]}));
 try{
  const response=await mf.dispatchFetch('https://example.test/api/cms/content',{headers:{Cookie:'private-session',Authorization:'private-credential'}});
  assert.equal(response.status,200);assert.equal((await response.json()).revision,4);
 }finally{await mf.dispose()}
});
