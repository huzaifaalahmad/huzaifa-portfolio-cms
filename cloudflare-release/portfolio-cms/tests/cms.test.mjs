import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import worker,{validContent} from '../worker.mjs';
import {database} from '../local-db.mjs';
const seed=JSON.parse(readFileSync(new URL('../seed.json',import.meta.url),'utf8'));
const origin='http://127.0.0.1:4174';
function setup(){const env={DB:database(':memory:',seed),ASSETS:{fetch:()=>new Response('asset')},LOCAL_DEV:'true',LOCAL_OWNER_KEY:'local-test-code'};let cookie='',csrf='';return {env,async req(route,method='GET',body,extra={}){const r=await worker.fetch(new Request(origin+'/api/cms/'+route,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie,'X-CSRF-Token':csrf,...extra},...(body===undefined?{}:{body:JSON.stringify(body)})}),env);return r},async login(){const r=await this.req('auth/local','POST',{key:'local-test-code'});assert.equal(r.status,200);cookie=r.headers.get('Set-Cookie').split(';')[0];csrf=(await r.json()).csrf;},close(){env.DB.close()}}}
test('public content; protected mutations; CSRF and origin; persistent revisions and restore',async()=>{
 const s=setup();try{
  const first=await(await s.req('content')).json();assert.equal(first.content.jobs.length,5);assert.equal(first.content.projects.length,7);assert.equal(first.content.certificates.length,24);
  assert.equal((await s.req('content','PUT',{content:seed,revision:1})).status,401);
  assert.equal((await s.req('auth/local','POST',{key:'wrong'})).status,401);
  await s.login();
  assert.equal((await s.req('content','PUT',{content:seed,revision:1},{Origin:'https://untrusted.example'})).status,403);
  assert.equal((await s.req('content','PUT',{content:seed,revision:1},{'X-CSRF-Token':'wrong'})).status,403);
  const next=structuredClone(seed);next.site.intro.ar='نص عربي محفوظ للاختبار';next.site.intro.en='Verified persisted content';
  assert.equal((await s.req('content','PUT',{content:next,revision:1})).status,200);
  assert.equal((await(await s.req('content')).json()).content.site.intro.ar,next.site.intro.ar);
  assert.equal((await s.req('content','PUT',{content:seed,revision:1})).status,409);
  const invalid=structuredClone(next);invalid.site.behance='javascript:alert(1)';assert.equal((await s.req('content','PUT',{content:invalid,revision:2})).status,400);
  const restored=await(await s.req('restore','POST',{restoreRevision:1,revision:2})).json();assert.equal(restored.revision,3);assert.deepEqual(restored.content,seed);
  assert.equal((await(await s.req('history')).json()).length,3);
  await s.req('logout','POST');assert.equal((await s.req('history')).status,401);
 }finally{s.close()}
});
test('expired sessions and local access disabled in production',async()=>{const s=setup();try{await s.login();await s.env.DB.prepare('UPDATE sessions SET expires=0').run();assert.equal((await s.req('history')).status,401);delete s.env.LOCAL_DEV;assert.equal((await s.req('auth/local','POST',{key:'local-test-code'})).status,404);assert.equal((await s.req('auth/start')).status,503)}finally{s.close()}});
test('a saved version survives closing and reopening the local database',async()=>{const dir=mkdtempSync(path.join(tmpdir(),'huzaifa-cms-'));try{const file=path.join(dir,'test.sqlite');let db=database(file,seed);await db.prepare('UPDATE content SET revision=7 WHERE id=1').run();db.close();db=database(file,seed);assert.equal((await db.prepare('SELECT revision FROM content WHERE id=1').first()).revision,7);db.close();}finally{rmSync(dir,{recursive:true,force:true})}});
test('schema rejects unsafe destinations and preserves all sections',()=>{assert.ok(validContent(seed));for(const url of ['javascript:alert(1)','//untrusted.example','/\\example','data:text/html,x']){const c=structuredClone(seed);c.site.cvUrl=url;assert.equal(validContent(c),false)}const bad=structuredClone(seed);delete bad.jobs;assert.equal(validContent(bad),false)});
test('simultaneous edits preserve one winner and reject the stale version',async()=>{const s=setup();try{await s.login();const results=await Promise.all([s.req('content','PUT',{content:seed,revision:1}),s.req('content','PUT',{content:seed,revision:1})]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);}finally{s.close()}});
test('production OAuth checks state, rejects another account and creates secure owner sessions',async()=>{const s=setup();const originalFetch=globalThis.fetch;try{delete s.env.LOCAL_DEV;delete s.env.LOCAL_OWNER_KEY;s.env.GITHUB_CLIENT_ID='test-client';s.env.GITHUB_CLIENT_SECRET='test-secret';s.env.OWNER_GITHUB_ID='243386131';let ownerId=1;globalThis.fetch=async url=>Response.json(String(url).includes('access_token')?{access_token:'test-only-token'}:{id:ownerId});assert.equal((await s.req('auth/callback?state=bad&code=test')).status,403);const start=await s.req('auth/start');assert.equal(start.status,302);assert.ok(start.headers.get('Set-Cookie').includes('Secure'));const state=new URL(start.headers.get('Location')).searchParams.get('state');const headers={Cookie:'cms_oauth_state='+state};assert.equal((await s.req('auth/callback?state='+state+'&code=test','GET',undefined,headers)).status,403);ownerId=243386131;const allowed=await s.req('auth/callback?state='+state+'&code=test','GET',undefined,headers);assert.equal(allowed.status,302);assert.equal(allowed.headers.get('Location'),'/cms');assert.ok(allowed.headers.get('Set-Cookie').includes('Secure'));}finally{globalThis.fetch=originalFetch;s.close()}});
