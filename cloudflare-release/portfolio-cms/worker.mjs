const encoder=new TextEncoder();
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
const cookies=request=>Object.fromEntries((request.headers.get('Cookie')||'').split(';').map(s=>s.trim().split('=')).filter(a=>a.length===2));
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow',...headers}});
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
const local=env=>env.LOCAL_DEV==='true'&&!!env.LOCAL_OWNER_KEY;
const cookie=(env,name,value,age)=>`${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${local(env)?'':'; Secure'}`;
function sameOrigin(request){if(request.headers.get('Origin')!==new URL(request.url).origin)fail('Request origin rejected',403)}
const text=(v,max=4000)=>typeof v==='string'&&v.length<=max&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v);
const copy=v=>v&&text(v.en)&&text(v.ar);
export function safeUrl(v){return typeof v==='string'&&v.length<1500&&!/[\\\s\u0000-\u001f]/.test(v)&&(v.startsWith('/')&&!v.startsWith('//')||/^https:\/\//i.test(v))}
export function validContent(c){
 if(!c||!Array.isArray(c.jobs)||!Array.isArray(c.projects)||!Array.isArray(c.certificates))return false;
 if(c.jobs.length>40||c.projects.length>60||c.certificates.length>100)return false;
 if(!c.jobs.every(j=>j&&text(j.company,240)&&j.company.trim()&&copy(j.role)&&copy(j.dates)&&copy(j.location)&&Array.isArray(j.bullets)&&j.bullets.length<=30&&j.bullets.every(copy)))return false;
 if(!c.projects.every(p=>p&&text(p.name,240)&&p.name.trim()&&copy(p.desc)&&copy(p.status)&&(p.url===null||p.url===''||safeUrl(p.url))&&(!p.repositoryUrl||safeUrl(p.repositoryUrl))&&(!p.logo||safeUrl(p.logo))))return false;
 if(!c.certificates.every(r=>r&&text(r.title,500)&&r.title.trim()&&copy(r.kind)&&safeUrl(r.url)))return false;
 if(!c.contact||!text(c.contact.email,254)||!/^\S+@\S+\.\S+$/.test(c.contact.email)||!text(c.contact.phone,40)||!/^\+?[0-9 ]+$/.test(c.contact.phone)||!text(c.contact.phoneDisplay,50))return false;
 const s=c.site;if(!s)return false;
 if(!['name','role','intro','about','location','education'].every(k=>copy(s[k])))return false;
 if(!['portrait','cvUrl','behance','instagram','linkedin','github'].every(k=>safeUrl(s[k])))return false;
 if(!['light','dark'].includes(s.defaultTheme))return false;
 return true;
}
async function session(request,env){
 const raw=cookies(request).cms_session;if(!raw)return null;
 return env.DB.prepare('SELECT csrf, expires FROM sessions WHERE token_hash=? AND expires>?').bind(await hash(raw),Date.now()).first();
}
async function requireOwner(request,env,write=false){
 const s=await session(request,env);if(!s)fail('Sign in required',401);
 if(write){sameOrigin(request);if(request.headers.get('X-CSRF-Token')!==s.csrf)fail('Request token rejected',403)}return s;
}
async function startSession(env){
 const raw=token(),csrf=token();
 await env.DB.prepare('DELETE FROM sessions WHERE expires<=?').bind(Date.now()).run();
 await env.DB.prepare('INSERT INTO sessions(token_hash,csrf,expires) VALUES(?,?,?)').bind(await hash(raw),csrf,Date.now()+8*3600000).run();
 return {raw,csrf};
}
async function content(env){const row=await env.DB.prepare('SELECT json,revision,updated_at FROM content WHERE id=1').first();if(!row)fail('Content database is not initialized',503);return {content:JSON.parse(row.json),revision:row.revision,updatedAt:row.updated_at}}
async function save(env,data,expected){
 if(!Number.isSafeInteger(expected)||!validContent(data))fail('Invalid content; check text, links and required fields');
 const serial=JSON.stringify(data);if(encoder.encode(serial).length>180000)fail('Content is too large',413);
 const now=new Date().toISOString();
 const result=await env.DB.batch([
  env.DB.prepare('UPDATE content SET json=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=?').bind(serial,now,expected),
  env.DB.prepare('INSERT OR IGNORE INTO history(revision,json,created_at) SELECT revision,json,updated_at FROM content WHERE id=1'),
  env.DB.prepare('DELETE FROM history WHERE revision < (SELECT MAX(revision)-19 FROM history)'),
 ]);
 if(!result[0].meta.changes)fail('A newer version exists. Reload before saving.',409);
 return content(env);
}
async function readJson(request){
 if(!request.headers.get('Content-Type')?.includes('application/json'))fail('JSON required',415);
 if(Number(request.headers.get('Content-Length'))>200000||!request.body)fail('Request too large or empty',413);
 const reader=request.body.getReader(),decoder=new TextDecoder();let bytes=0,raw='';
 for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>200000){await reader.cancel();fail('Request too large',413)}raw+=decoder.decode(value,{stream:true})}raw+=decoder.decode();
 try{return JSON.parse(raw)}catch{fail('Invalid JSON')}
}
async function oauth(request,env,path){
 if(!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET||!env.OWNER_GITHUB_ID)fail('Production sign-in is not configured yet',503);
 const url=new URL(request.url),redirect=url.origin+'/api/cms/auth/callback';
 if(path.endsWith('/start')){
  const state=token();const dest=new URL('https://github.com/login/oauth/authorize');dest.search=new URLSearchParams({client_id:env.GITHUB_CLIENT_ID,redirect_uri:redirect,state}).toString();
  return new Response(null,{status:302,headers:{Location:dest.href,'Set-Cookie':cookie(env,'cms_oauth_state',state,600),'Cache-Control':'no-store'}});
 }
 const state=url.searchParams.get('state'),code=url.searchParams.get('code');
 if(!state||state!==cookies(request).cms_oauth_state||!code)fail('Sign-in state rejected',403);
 const exchange=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:redirect})});
 const auth=await exchange.json();if(!exchange.ok||!auth.access_token)fail('GitHub sign-in failed',401);
 const userResponse=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${auth.access_token}`,Accept:'application/vnd.github+json','User-Agent':'Huzaifa-Portfolio-CMS'}});
 const user=await userResponse.json();if(!userResponse.ok||String(user.id)!==String(env.OWNER_GITHUB_ID))fail('Only the portfolio owner can sign in',403);
 const s=await startSession(env),headers=new Headers({Location:'/cms','Cache-Control':'no-store'});headers.append('Set-Cookie',cookie(env,'cms_session',s.raw,28800));headers.append('Set-Cookie',cookie(env,'cms_oauth_state','',0));
 return new Response(null,{status:302,headers});
}
export default {async fetch(request,env){
 try{
  const path=new URL(request.url).pathname,method=request.method;
  if(path==='/api/cms/content'&&method==='GET')return json(await content(env));
  if(path==='/api/cms/session'&&method==='GET'){const s=await session(request,env);return json({authenticated:!!s,csrf:s?.csrf||null,mode:local(env)?'local':'production'})}
  if(path==='/api/cms/auth/local'&&method==='POST'){
   if(!local(env)||!['127.0.0.1','localhost','[::1]'].includes(new URL(request.url).hostname))fail('Not found',404);
   sameOrigin(request);const body=await readJson(request);
   if(typeof body.key!=='string'||await hash(body.key)!==await hash(env.LOCAL_OWNER_KEY))fail('Invalid access code',401);
   const s=await startSession(env);return json({authenticated:true,csrf:s.csrf},200,{'Set-Cookie':cookie(env,'cms_session',s.raw,28800)});
  }
  if((path==='/api/cms/auth/start'||path==='/api/cms/auth/callback')&&method==='GET')return await oauth(request,env,path);
  if(path==='/api/cms/logout'&&method==='POST'){await requireOwner(request,env,true);await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await hash(cookies(request).cms_session)).run();return json({ok:true},200,{'Set-Cookie':cookie(env,'cms_session','',0)})}
  if(path==='/api/cms/content'&&method==='PUT'){await requireOwner(request,env,true);const b=await readJson(request);return json(await save(env,b.content,b.revision))}
  if(path==='/api/cms/history'&&method==='GET'){await requireOwner(request,env);const r=await env.DB.prepare('SELECT revision,created_at FROM history ORDER BY revision DESC LIMIT 20').all();return json(r.results)}
  if(path==='/api/cms/restore'&&method==='POST'){await requireOwner(request,env,true);const b=await readJson(request);if(!Number.isSafeInteger(b.restoreRevision))fail('Invalid version');const old=await env.DB.prepare('SELECT json FROM history WHERE revision=?').bind(b.restoreRevision).first();if(!old)fail('Version not found',404);return json(await save(env,JSON.parse(old.json),b.revision))}
  if(path.startsWith('/api/'))return json({error:'Not found'},404);
  const url=new URL(request.url);
  const publicOrigin=env.PUBLIC_SITE_ORIGIN==='https://huzaifa-alahmad.pages.dev'?env.PUBLIC_SITE_ORIGIN:null;
  if(publicOrigin&&path==='/'&&['GET','HEAD'].includes(method))return new Response(null,{status:308,headers:{Location:publicOrigin+'/','Cache-Control':'public, max-age=3600'}});
  const aliases={'/index.html':'/','/projects':'/#projects','/projects/':'/#projects','/contact':'/#contact','/contact/':'/#contact','/about':'/#about','/experience':'/#experience','/cv':'/assets/personal/Huzaifa-Alahmad-CV.pdf'};
  if(Object.hasOwn(aliases,path))return new Response(null,{status:308,headers:{Location:(publicOrigin||'')+aliases[path],'Cache-Control':'public, max-age=3600'}});
  if(path.startsWith('/admin'))return new Response(null,{status:308,headers:{Location:'/cms','X-Robots-Tag':'noindex, nofollow'}});
  const privatePage=['/cms','/cms/','/cms-preview','/dashboard-preview','/cms-shell','/cms-shell.html'].includes(path);
  if(privatePage)url.pathname='/cms-shell';
  const response=await env.ASSETS.fetch(privatePage?new Request(url,request):request);
  const headers=new Headers(response.headers);
  if(privatePage){headers.set('X-Robots-Tag','noindex, nofollow');headers.set('Cache-Control','no-store')}
  headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  headers.set('Content-Security-Policy',"default-src 'self'; img-src 'self' https: data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");
  return new Response(response.body,{status:response.status,headers});
 }catch(e){return json({error:e.status?e.message:'The service could not complete this request'},e.status||500)}
}};
