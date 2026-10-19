// Public frontend only. Owner authentication remains on the existing CMS origin.
const CMS_ORIGIN='https://huzaifa-portfolio.huzaifaalahmad23.workers.dev';
export default {async fetch(request,env){
 const url=new URL(request.url),path=url.pathname;
 if(path==='/api/cms/content'&&['GET','HEAD'].includes(request.method)){
  try{
   const response=await env.CONTENT_SERVICE.fetch(CMS_ORIGIN+'/api/cms/content',{method:'GET',headers:{Accept:'application/json'},redirect:'manual',signal:AbortSignal.timeout(15000)});
   if(response.status!==200||!response.headers.get('Content-Type')?.includes('application/json'))throw new Error('Unexpected content response');
   return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'}});
  }catch{return Response.json({error:'Content is temporarily unavailable'},{status:503,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}})}
 }
 if(path.startsWith('/api/'))return Response.json({error:'Not found'},{status:404,headers:{'X-Robots-Tag':'noindex, nofollow'}});
 if(path.startsWith('/cms')||path.startsWith('/admin')||path==='/dashboard-preview'){
  const destination=path==='/cms-preview'?'/cms-preview':'/cms';
  return new Response(null,{status:302,headers:{Location:CMS_ORIGIN+destination,'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
 }
 return env.ASSETS.fetch(request);
}};
