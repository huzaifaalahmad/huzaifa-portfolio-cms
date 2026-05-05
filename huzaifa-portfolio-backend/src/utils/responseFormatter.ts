import{Response}from'express';
export const sendSuccess=<T>(r:Response,d:T,m?:string,s=200,meta?:any)=>r.status(s).json({success:true,data:d,message:m,meta});
export const sendError=(r:Response,c:string,m:string,s=500,d?:any)=>r.status(s).json({success:false,error:{code:c,message:m,details:d}});
