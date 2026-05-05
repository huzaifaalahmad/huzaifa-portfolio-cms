import{Request,Response,NextFunction}from'express';
export const securityHeaders=(r:Request,res:Response,n:NextFunction)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('X-XSS-Protection','1; mode=block');n();};
