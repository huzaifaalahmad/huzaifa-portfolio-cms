import{Request,Response,NextFunction}from'express';import crypto from'crypto';import{ForbiddenError}from'@/utils/errorClasses';import{env}from'@/config/env';
export class CsrfProtection{private secret:string;constructor(){this.secret=env.CSRF_SECRET||crypto.randomBytes(32).toString('hex');}
private generateToken(){return crypto.randomBytes(32).toString('hex');}
private hashToken(t:string){return crypto.createHmac('sha256',this.secret).update(t).digest('hex');}
generateMiddleware=(r:Request,res:Response,n:NextFunction)=>{const t=this.generateToken();const h=this.hashToken(t);res.cookie('csrf-token',h,{httpOnly:true,secure:env.NODE_ENV==='production',sameSite:'strict',maxAge:3600000});res.setHeader('X-CSRF-Token',t);n();};
verifyMiddleware=(r:Request,res:Response,n:NextFunction)=>{if(['GET','HEAD','OPTIONS'].includes(r.method))return n();if(r.path.startsWith('/api/v1/health'))return n();const c=r.headers['x-csrf-token']as string;const k=r.cookies['csrf-token'];if(!c||!k)return n(new ForbiddenError('CSRF token missing'));if(this.hashToken(c)!==k)return n(new ForbiddenError('Invalid CSRF token'));n();};}
export const csrfProtection=new CsrfProtection();
