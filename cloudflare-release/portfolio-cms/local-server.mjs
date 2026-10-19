import http from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import worker from './worker.mjs';
import {database} from './local-db.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),state=path.join(here,'.local'),dist=path.resolve(here,'../huzaifa-portfolio-frontend/dist');
await mkdir(state,{recursive:true});
let key;try{key=await readFile(path.join(state,'owner-key'),'utf8')}catch{key=randomBytes(32).toString('hex');await writeFile(path.join(state,'owner-key'),key,{mode:0o600})}
const seed=JSON.parse(await readFile(path.resolve(here,'../huzaifa-portfolio-frontend/src/data/personalProfile.json'),'utf8'));
const DB=database(path.join(state,'content.sqlite'),seed);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.pdf':'application/pdf','.ttf':'font/ttf'};
const ASSETS={async fetch(request){const url=new URL(request.url);let name=decodeURIComponent(url.pathname);if(name==='/')name='/index.html';let file=path.resolve(dist,'.'+name),status=200;if(!file.startsWith(dist+path.sep))return new Response('Not found',{status:404});try{if(!(await stat(file)).isFile())throw Error()}catch{const html=path.resolve(dist,'.'+name+'.html');try{if(!(await stat(html)).isFile())throw Error();file=html;}catch{file=path.join(dist,'404.html');status=404;}}try{return new Response(await readFile(file),{status,headers:{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'}})}catch{return new Response('Build the frontend first',{status:503})}}};
const port=Number(process.env.PORT||4174);
http.createServer(async(req,res)=>{
 try{
  if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`){res.writeHead(403).end();return}
  const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>200000){res.writeHead(413).end();return}chunks.push(chunk)}
  const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(v)headers.set(k,Array.isArray(v)?v.join(','):v);
  const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const response=await worker.fetch(request,{DB,ASSETS,LOCAL_DEV:'true',LOCAL_OWNER_KEY:key});
  res.statusCode=response.status;for(const[k,v]of response.headers)if(k!=='set-cookie')res.setHeader(k,v);if(response.headers.getSetCookie().length)res.setHeader('Set-Cookie',response.headers.getSetCookie());
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500).end('Local request failed')}
}).listen(port,'127.0.0.1',()=>console.log(`Portfolio and CMS: http://127.0.0.1:${port}/cms (local owner access code stored in portfolio-cms/.local/owner-key)`));
