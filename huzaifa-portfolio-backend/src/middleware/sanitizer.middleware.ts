import{Request,Response,NextFunction}from'express';import sanitizeHtml from'sanitize-html';
export const sanitizeInput=(r:Request,res:Response,n:NextFunction)=>{if(r.body)r.body=sanitizeObject(r.body);n();};
function sanitizeObject(o:any):any{if(typeof o==='string')return sanitizeHtml(o,{allowedTags:[],allowedAttributes:{}});if(Array.isArray(o))return o.map(sanitizeObject);if(typeof o==='object'&&o!==null){const s:any={};for(const[k,v]of Object.entries(o))s[k]=sanitizeObject(v);return s;}return o;}
