import{Request,Response,NextFunction}from'express';
export const asyncHandler=(fn:(r:Request,res:Response,n:NextFunction)=>Promise<any>)=>(r:Request,res:Response,n:NextFunction)=>Promise.resolve(fn(r,res,n)).catch(n);
