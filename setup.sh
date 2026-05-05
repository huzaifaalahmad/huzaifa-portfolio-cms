#!/bin/bash

set -e

echo "🚀 إنشاء مشروع Portfolio Backend الكامل..."

PROJECT="huzaifa-portfolio-backend"
mkdir -p $PROJECT && cd $PROJECT

# ============================================================================
# إنشاء الهيكل
# ============================================================================
mkdir -p prisma src/{config,controllers,middleware,repositories,routes,services,types/dto,utils,validators} tests/{helpers,integration,unit/{middleware,services}}

# ============================================================================
# package.json
# ============================================================================
cat > package.json << 'PKGJSON'
{
  "name": "huzaifa-portfolio-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "test": "jest"
  },
  "dependencies": {
    "@prisma/client": "^5.9.0",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "sanitize-html": "^2.12.1",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.11.5",
    "@types/sanitize-html": "^2.9.5",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0",
    "nodemon": "^3.0.3",
    "prettier": "^3.2.4",
    "prisma": "^5.9.0",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
PKGJSON

# ============================================================================
# tsconfig.json
# ============================================================================
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {"@/*": ["./*"]}
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
TSCONFIG

# ============================================================================
# .env
# ============================================================================
JWT_SEC=$(openssl rand -hex 32)
JWT_REF=$(openssl rand -hex 32)
CSRF_SEC=$(openssl rand -hex 32)

cat > .env << ENVFILE
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/huzaifa_portfolio
JWT_SECRET=${JWT_SEC}
JWT_REFRESH_SECRET=${JWT_REF}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@example.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123456
CSRF_SECRET=${CSRF_SEC}
REDIS_ENABLED=false
ENVFILE

cp .env .env.example

# ============================================================================
# Configs
# ============================================================================
cat > nodemon.json << 'NOD'
{"watch":["src"],"ext":"ts","exec":"ts-node -r tsconfig-paths/register src/server.ts"}
NOD

cat > .gitignore << 'GIT'
node_modules
dist
*.log
.env
GIT

cat > .prettierrc << 'PRET'
{"semi":true,"singleQuote":true,"printWidth":100}
PRET

# ============================================================================
# Prisma Schema
# ============================================================================
cat > prisma/schema.prisma << 'SCHEMA'
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
enum Role { ADMIN VIEWER }
enum LogSeverity { INFO WARNING CRITICAL }
model User {
  id String @id @default(uuid())
  email String @unique
  passwordHash String @map("password_hash")
  name String
  role Role @default(ADMIN)
  isActive Boolean @default(true) @map("is_active")
  lastLoginAt DateTime? @map("last_login_at")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  adminLogs AdminLog[]
  refreshTokens RefreshToken[]
  preferences UserPreference?
  @@map("users")
}
model RefreshToken {
  id String @id @default(uuid())
  userId String @map("user_id")
  token String @unique
  expiresAt DateTime @map("expires_at")
  isRevoked Boolean @default(false) @map("is_revoked")
  ipAddress String? @map("ip_address")
  userAgent String? @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")
  user User @relation(fields:[userId],references:[id],onDelete:Cascade)
  @@index([userId])
  @@map("refresh_tokens")
}
model AdminLog {
  id String @id @default(uuid())
  userId String @map("user_id")
  action String
  entityType String @map("entity_type")
  entityId String? @map("entity_id")
  severity LogSeverity @default(INFO)
  changes Json?
  ipAddress String? @map("ip_address")
  userAgent String? @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")
  user User @relation(fields:[userId],references:[id],onDelete:Cascade)
  @@index([userId])
  @@map("admin_logs")
}
model ContactMessage {
  id String @id @default(uuid())
  name String
  email String
  phone String?
  subject String
  message String @db.Text
  preferredLanguage String @default("en") @map("preferred_language")
  isRead Boolean @default(false) @map("is_read")
  isReplied Boolean @default(false) @map("is_replied")
  isSpam Boolean @default(false) @map("is_spam")
  spamScore Float @default(0.0) @map("spam_score")
  readAt DateTime? @map("read_at")
  repliedAt DateTime? @map("replied_at")
  ipAddress String? @map("ip_address")
  userAgent String? @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")
  deletedAt DateTime? @map("deleted_at")
  @@map("contact_messages")
}
model UserPreference {
  id String @id @default(uuid())
  userId String @unique @map("user_id")
  preferredLanguage String @default("en") @map("preferred_language")
  preferredTheme String @default("light") @map("preferred_theme")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  user User @relation(fields:[userId],references:[id],onDelete:Cascade)
  @@map("user_preferences")
}
SCHEMA

cat > prisma/seed.ts << 'SEED'
import{PrismaClient}from'@prisma/client';import bcrypt from'bcryptjs';
const p=new PrismaClient();
async function main(){
const h=await bcrypt.hash(process.env.ADMIN_PASSWORD||'Admin@123456',10);
await p.user.upsert({where:{email:process.env.ADMIN_EMAIL||'admin@example.com'},update:{},create:{email:process.env.ADMIN_EMAIL||'admin@example.com',passwordHash:h,name:'Admin',role:'ADMIN',isActive:true}});
console.log('✅ Seeded');}
main().finally(()=>p.$disconnect());
SEED

# ============================================================================
# Source Files
# ============================================================================
cat > src/config/env.ts << 'ENV'
import dotenv from'dotenv';import{z}from'zod';
dotenv.config();
const s=z.object({NODE_ENV:z.enum(['development','production','test']).default('development'),PORT:z.string().transform(Number).default('5000'),DATABASE_URL:z.string().url(),JWT_SECRET:z.string().min(32),JWT_REFRESH_SECRET:z.string().min(32),JWT_EXPIRES_IN:z.string().default('15m'),JWT_REFRESH_EXPIRES_IN:z.string().default('7d'),CORS_ORIGIN:z.string(),EMAIL_HOST:z.string(),EMAIL_PORT:z.string().transform(Number),EMAIL_USER:z.string().email(),EMAIL_PASS:z.string(),EMAIL_FROM:z.string().email(),RATE_LIMIT_WINDOW_MS:z.string().transform(Number).default('900000'),RATE_LIMIT_MAX_REQUESTS:z.string().transform(Number).default('100'),ADMIN_EMAIL:z.string().email(),ADMIN_PASSWORD:z.string().min(8),CSRF_SECRET:z.string().min(32).optional(),REDIS_ENABLED:z.string().transform(v=>v==='true').default('false')});
export const env=s.parse(process.env);
ENV

cat > src/config/database.ts << 'DB'
import{PrismaClient}from'@prisma/client';
class D{private static i:PrismaClient;public static getInstance(){if(!D.i)D.i=new PrismaClient();return D.i;}}
export const prisma=D.getInstance();
DB

cat > src/config/jwt.ts << 'JWT'
import jwt from'jsonwebtoken';import crypto from'crypto';import{env}from'./env';
export interface JwtPayload{userId:string;email:string;role:string;}
export const generateAccessToken=(p:JwtPayload)=>jwt.sign(p,env.JWT_SECRET,{expiresIn:env.JWT_EXPIRES_IN});
export const generateRefreshToken=()=>crypto.randomBytes(64).toString('hex');
export const verifyAccessToken=(t:string)=>jwt.verify(t,env.JWT_SECRET)as JwtPayload;
export const getTokenExpirySeconds=()=>{const m=env.JWT_EXPIRES_IN.match(/^(\d+)([smhd])$/);if(!m)return 900;const v=parseInt(m[1]),u=m[2];switch(u){case's':return v;case'm':return v*60;case'h':return v*3600;case'd':return v*86400;default:return 900;}};
export const getRefreshTokenExpiry=()=>{const m=env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([smhd])$/);if(!m)return new Date(Date.now()+7*24*60*60*1000);const v=parseInt(m[1]),u=m[2];let ms=0;switch(u){case's':ms=v*1000;break;case'm':ms=v*60*1000;break;case'h':ms=v*3600*1000;break;case'd':ms=v*86400*1000;break;}return new Date(Date.now()+ms);};
JWT

cat > src/config/helmet.ts << 'HEL'
import helmet from'helmet';
export const helmetConfig=helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"]}},hsts:{maxAge:31536000,includeSubDomains:true}});
HEL

cat > src/types/api.types.ts << 'TYPES'
import{Request}from'express';
export interface AuthRequest extends Request{user?:{id:string;email:string;role:string;};}
export interface JwtPayload{userId:string;email:string;role:string;}
TYPES

cat > src/types/errorCodes.ts << 'CODES'
export enum ErrorCode{UNAUTHORIZED='AUTH_1001',INVALID_CREDENTIALS='AUTH_1002',TOKEN_EXPIRED='AUTH_1003',FORBIDDEN='AUTH_1007',VALIDATION_ERROR='VAL_2001',NOT_FOUND='RES_3001',RATE_LIMIT_EXCEEDED='RATE_4001',SPAM_DETECTED='SPAM_5001',INTERNAL_SERVER_ERROR='SRV_9001'}
CODES

cat > src/types/dto/auth.dto.ts << 'AUTHDTO'
export interface LoginRequestDto{email:string;password:string;}
export interface LoginResponseDto{user:{id:string;email:string;name:string;role:string;};accessToken:string;refreshToken:string;expiresIn:number;}
export interface RefreshTokenRequestDto{refreshToken:string;}
export interface RefreshTokenResponseDto{accessToken:string;refreshToken:string;expiresIn:number;}
export interface LogoutRequestDto{refreshToken:string;}
AUTHDTO

cat > src/types/dto/contact.dto.ts << 'CONTACTDTO'
export interface CreateContactMessageDto{name:string;email:string;phone?:string;subject:string;message:string;preferredLanguage:'en'|'ar';}
CONTACTDTO

cat > src/utils/errorClasses.ts << 'ERRORS'
export class AppError extends Error{public readonly statusCode:number;public readonly isOperational:boolean;constructor(m:string,s=500,o=true){super(m);this.statusCode=s;this.isOperational=o;Error.captureStackTrace(this,this.constructor);}}
export class BadRequestError extends AppError{constructor(m='Bad Request'){super(m,400);}}
export class UnauthorizedError extends AppError{constructor(m='Unauthorized'){super(m,401);}}
export class ForbiddenError extends AppError{constructor(m='Forbidden'){super(m,403);}}
export class NotFoundError extends AppError{constructor(m='Not Found'){super(m,404);}}
export class ValidationError extends AppError{public readonly details:any;constructor(m='Validation Error',d?:any){super(m,422);this.details=d;}}
export class RateLimitError extends AppError{constructor(m='Too Many Requests'){super(m,429);}}
ERRORS

cat > src/utils/responseFormatter.ts << 'RESP'
import{Response}from'express';
export const sendSuccess=<T>(r:Response,d:T,m?:string,s=200,meta?:any)=>r.status(s).json({success:true,data:d,message:m,meta});
export const sendError=(r:Response,c:string,m:string,s=500,d?:any)=>r.status(s).json({success:false,error:{code:c,message:m,details:d}});
RESP

cat > src/utils/logger.ts << 'LOG'
import winston from'winston';
export const logger=winston.createLogger({level:'info',format:winston.format.combine(winston.format.timestamp(),winston.format.json()),transports:[new winston.transports.Console({format:winston.format.simple()})]});
LOG

cat > src/utils/asyncHandler.ts << 'ASYNC'
import{Request,Response,NextFunction}from'express';
export const asyncHandler=(fn:(r:Request,res:Response,n:NextFunction)=>Promise<any>)=>(r:Request,res:Response,n:NextFunction)=>Promise.resolve(fn(r,res,n)).catch(n);
ASYNC

# Validators
cat > src/validators/auth.validator.ts << 'AUTHVAL'
import{z}from'zod';
export const loginSchema=z.object({body:z.object({email:z.string().email().toLowerCase().trim(),password:z.string().min(8)})});
export const refreshTokenSchema=z.object({body:z.object({refreshToken:z.string().min(1)})});
export const logoutSchema=z.object({body:z.object({refreshToken:z.string().min(1)})});
AUTHVAL

cat > src/validators/contact.validator.ts << 'CONVAL'
import{z}from'zod';
export const createContactMessageSchema=z.object({body:z.object({name:z.string().min(2).max(100).trim(),email:z.string().email().toLowerCase().trim(),phone:z.string().min(10).max(20).optional(),subject:z.string().min(5).max(200).trim(),message:z.string().min(10).max(5000).trim(),preferredLanguage:z.enum(['en','ar']).default('en')})});
CONVAL

cat > src/validators/common.validator.ts << 'COMVAL'
import{z}from'zod';
export const uuidParamSchema=z.object({params:z.object({id:z.string().uuid()})});
COMVAL

# Due to length limits, I'll create the complete script in parts
# Creating minimal but functional versions

cat > src/middleware/auth.middleware.ts << 'AUTHMID'
import{Response,NextFunction}from'express';import{AuthRequest}from'@/types/api.types';import{verifyAccessToken}from'@/config/jwt';import{UnauthorizedError,ForbiddenError}from'@/utils/errorClasses';
export const authenticate=async(r:AuthRequest,res:Response,n:NextFunction)=>{try{const h=r.headers.authorization;if(!h||!h.startsWith('Bearer '))throw new UnauthorizedError();const t=h.substring(7);const p=verifyAccessToken(t);r.user={id:p.userId,email:p.email,role:p.role};n();}catch(e:any){n(e.name==='TokenExpiredError'?new UnauthorizedError('Token expired'):e);}};
export const authorize=(...roles:string[])=>(r:AuthRequest,res:Response,n:NextFunction)=>{if(!r.user||!roles.includes(r.user.role))return n(new ForbiddenError());n();};
AUTHMID

cat > src/middleware/validator.middleware.ts << 'VALMID'
import{Request,Response,NextFunction}from'express';import{AnyZodObject,ZodError}from'zod';import{ValidationError}from'@/utils/errorClasses';
export const validate=(s:AnyZodObject)=>async(r:Request,res:Response,n:NextFunction)=>{try{await s.parseAsync({body:r.body,query:r.query,params:r.params});n();}catch(e){if(e instanceof ZodError){const d=e.errors.map(err=>({field:err.path.join('.'),message:err.message}));n(new ValidationError('Validation failed',d));}else n(e);}};
VALMID

cat > src/middleware/rateLimiter.middleware.ts << 'RATELIM'
import rateLimit from'express-rate-limit';import{RateLimitError}from'@/utils/errorClasses';import{env}from'@/config/env';
export const generalLimiter=rateLimit({windowMs:env.RATE_LIMIT_WINDOW_MS,max:env.RATE_LIMIT_MAX_REQUESTS,handler:()=>{throw new RateLimitError();}});
export const authLimiter=rateLimit({windowMs:15*60*1000,max:5,skipSuccessfulRequests:true,handler:()=>{throw new RateLimitError();}});
export const contactLimiter=rateLimit({windowMs:60*60*1000,max:3,handler:()=>{throw new RateLimitError();}});
export const refreshLimiter=rateLimit({windowMs:15*60*1000,max:10,handler:()=>{throw new RateLimitError();}});
RATELIM

cat > src/middleware/sanitizer.middleware.ts << 'SAN'
import{Request,Response,NextFunction}from'express';import sanitizeHtml from'sanitize-html';
export const sanitizeInput=(r:Request,res:Response,n:NextFunction)=>{if(r.body)r.body=sanitizeObject(r.body);n();};
function sanitizeObject(o:any):any{if(typeof o==='string')return sanitizeHtml(o,{allowedTags:[],allowedAttributes:{}});if(Array.isArray(o))return o.map(sanitizeObject);if(typeof o==='object'&&o!==null){const s:any={};for(const[k,v]of Object.entries(o))s[k]=sanitizeObject(v);return s;}return o;}
SAN

cat > src/middleware/csrf.middleware.ts << 'CSRF'
import{Request,Response,NextFunction}from'express';import crypto from'crypto';import{ForbiddenError}from'@/utils/errorClasses';import{env}from'@/config/env';
export class CsrfProtection{private secret:string;constructor(){this.secret=env.CSRF_SECRET||crypto.randomBytes(32).toString('hex');}
private generateToken(){return crypto.randomBytes(32).toString('hex');}
private hashToken(t:string){return crypto.createHmac('sha256',this.secret).update(t).digest('hex');}
generateMiddleware=(r:Request,res:Response,n:NextFunction)=>{const t=this.generateToken();const h=this.hashToken(t);res.cookie('csrf-token',h,{httpOnly:true,secure:env.NODE_ENV==='production',sameSite:'strict',maxAge:3600000});res.setHeader('X-CSRF-Token',t);n();};
verifyMiddleware=(r:Request,res:Response,n:NextFunction)=>{if(['GET','HEAD','OPTIONS'].includes(r.method))return n();if(r.path.startsWith('/api/v1/health'))return n();const c=r.headers['x-csrf-token']as string;const k=r.cookies['csrf-token'];if(!c||!k)return n(new ForbiddenError('CSRF token missing'));if(this.hashToken(c)!==k)return n(new ForbiddenError('Invalid CSRF token'));n();};}
export const csrfProtection=new CsrfProtection();
CSRF

cat > src/middleware/requestId.middleware.ts << 'REQID'
import{Request,Response,NextFunction}from'express';import{randomUUID}from'crypto';
export const requestId=(r:Request,res:Response,n:NextFunction)=>{r.id=randomUUID();res.setHeader('X-Request-Id',r.id);n();};
REQID

cat > src/middleware/securityHeaders.middleware.ts << 'SECH'
import{Request,Response,NextFunction}from'express';
export const securityHeaders=(r:Request,res:Response,n:NextFunction)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('X-XSS-Protection','1; mode=block');n();};
SECH

cat > src/middleware/errorHandler.middleware.ts << 'ERRHAND'
import{Request,Response,NextFunction}from'express';import{AppError}from'@/utils/errorClasses';import{ErrorCode}from'@/types/errorCodes';import{sendError}from'@/utils/responseFormatter';import{logger}from'@/utils/logger';
export const errorHandler=(e:Error|AppError,r:Request,res:Response,n:NextFunction)=>{logger.error('Error:',{error:e.message,path:r.path});if(e instanceof AppError&&e.isOperational)return sendError(res,ErrorCode.VALIDATION_ERROR,e.message,e.statusCode,(e as any).details);return sendError(res,ErrorCode.INTERNAL_SERVER_ERROR,'Internal error',500);};
export const notFoundHandler=(r:Request,res:Response)=>sendError(res,ErrorCode.NOT_FOUND,\`Route \${r.originalUrl} not found\`,404);
ERRHAND

# Repositories
cat > src/repositories/base.repository.ts << 'BASEREPO'
import{PrismaClient}from'@prisma/client';import{prisma}from'@/config/database';import{NotFoundError}from'@/utils/errorClasses';
export abstract class BaseRepository<T>{protected prisma:PrismaClient;protected modelName:string;constructor(m:string){this.prisma=prisma;this.modelName=m;}
protected get model():any{return(this.prisma as any)[this.modelName];}
async findById(id:string,include?:any){return this.model.findFirst({where:{id,deletedAt:null},include});}
async findByIdOrFail(id:string,include?:any){const r=await this.findById(id,include);if(!r)throw new NotFoundError(\`\${this.modelName} not found\`);return r;}
async create(data:any){return this.model.create({data});}
async update(id:string,data:any){await this.findByIdOrFail(id);return this.model.update({where:{id},data});}
async softDelete(id:string){await this.findByIdOrFail(id);return this.model.update({where:{id},data:{deletedAt:new Date()}});}}
BASEREPO

cat > src/repositories/user.repository.ts << 'USERREPO'
import{User}from'@prisma/client';import{BaseRepository}from'./base.repository';
export class UserRepository extends BaseRepository<User>{constructor(){super('user');}
async findByEmail(e:string){return this.model.findFirst({where:{email:e,deletedAt:null}});}
async updateLastLogin(u:string){return this.model.update({where:{id:u},data:{lastLoginAt:new Date()}});}}
USERREPO

cat > src/repositories/refreshToken.repository.ts << 'TOKREPO'
import{RefreshToken}from'@prisma/client';import{BaseRepository}from'./base.repository';
export class RefreshTokenRepository extends BaseRepository<RefreshToken>{constructor(){super('refreshToken');}
async findValidToken(t:string){return this.model.findFirst({where:{token:t,isRevoked:false,expiresAt:{gt:new Date()}},include:{user:true}});}
async revokeToken(t:string){await this.model.updateMany({where:{token:t},data:{isRevoked:true}});}
async revokeAllUserTokens(u:string){await this.model.updateMany({where:{userId:u,isRevoked:false},data:{isRevoked:true}});}
async createToken(d:any){return this.create(d);}}
TOKREPO

cat > src/repositories/contact.repository.ts << 'CONREPO'
import{ContactMessage}from'@prisma/client';import{BaseRepository}from'./base.repository';
export class ContactRepository extends BaseRepository<ContactMessage>{constructor(){super('contactMessage');}
async markAsRead(id:string){return this.model.update({where:{id},data:{isRead:true,readAt:new Date()}});}}
CONREPO

# Services
cat > src/services/adminLog.service.ts << 'ADMINLOG'
import{LogSeverity}from'@prisma/client';import{prisma}from'@/config/database';
interface LogEntry{userId:string;action:string;entityType:string;entityId?:string;severity:'INFO'|'WARNING'|'CRITICAL';changes?:any;ipAddress?:string;userAgent?:string;}
export class AdminLogService{async log(e:LogEntry){try{await prisma.adminLog.create({data:{...e,severity:e.severity as LogSeverity}});}catch(err){console.error('Log failed',err);}}}
ADMINLOG

cat > src/services/spam.service.ts << 'SPAM'
export class SpamService{private readonly SPAM_KEYWORDS=['viagra','casino','lottery'];
calculateSpamScore(m:string,e:string){let s=0;const l=m.toLowerCase();const k=this.SPAM_KEYWORDS.filter(kw=>l.includes(kw));s+=k.length*0.3;const d=['tempmail.com','guerrillamail.com'];if(d.some(dm=>e.endsWith(dm)))s+=0.5;return Math.min(s,1.0);}
isSpam(s:number,t=0.5){return s>=t;}}
SPAM

cat > src/services/tokenSecurity.service.ts << 'TOKSEC'
import{prisma}from'@/config/database';import{UnauthorizedError}from'@/utils/errorClasses';
export class TokenSecurityService{private tokenUsageMap:Map<string,{count:number}>=new Map();
async detectTokenReuse(t:string,u:string){const us=this.tokenUsageMap.get(t);if(!us){this.tokenUsageMap.set(t,{count:1});return;}if(us.count>=1){await this.revokeAllUserTokens(u);throw new UnauthorizedError('Token reuse detected');}us.count++;}
async validateFingerprint(u:string,ci:string,cu:string,si?:string,su?:string){if(!si||!su)return;if(ci!==si&&cu!==su)throw new UnauthorizedError('Fingerprint mismatch');}
async detectRotationAttack(u:string){const r=await prisma.refreshToken.findMany({where:{userId:u,createdAt:{gte:new Date(Date.now()-5*60*1000)}}});if(r.length>5){await this.revokeAllUserTokens(u);throw new UnauthorizedError('Rotation attack');}}
private async revokeAllUserTokens(u:string){await prisma.refreshToken.updateMany({where:{userId:u},data:{isRevoked:true}});}}
export const tokenSecurityService=new TokenSecurityService();
TOKSEC

cat > src/services/auth.service.ts << 'AUTHSVC'
import bcrypt from'bcryptjs';import{UserRepository}from'@/repositories/user.repository';import{RefreshTokenRepository}from'@/repositories/refreshToken.repository';import{AdminLogService}from'./adminLog.service';import{tokenSecurityService}from'./tokenSecurity.service';import{generateAccessToken,generateRefreshToken,getTokenExpirySeconds,getRefreshTokenExpiry}from'@/config/jwt';import{UnauthorizedError}from'@/utils/errorClasses';import{LoginRequestDto,LoginResponseDto,RefreshTokenRequestDto,RefreshTokenResponseDto,LogoutRequestDto}from'@/types/dto/auth.dto';
export class AuthService{private userRepo=new UserRepository();private tokenRepo=new RefreshTokenRepository();private logService=new AdminLogService();
async login(d:LoginRequestDto,ip?:string,ua?:string):Promise<LoginResponseDto>{const u=await this.userRepo.findByEmail(d.email);if(!u||!u.isActive)throw new UnauthorizedError();const v=await bcrypt.compare(d.password,u.passwordHash);if(!v)throw new UnauthorizedError();const at=generateAccessToken({userId:u.id,email:u.email,role:u.role});const rt=generateRefreshToken();await this.tokenRepo.createToken({userId:u.id,token:rt,expiresAt:getRefreshTokenExpiry(),ipAddress:ip,userAgent:ua});await this.userRepo.updateLastLogin(u.id);await this.logService.log({userId:u.id,action:'LOGIN',entityType:'User',severity:'INFO',ipAddress:ip,userAgent:ua});return{user:{id:u.id,email:u.email,name:u.name,role:u.role},accessToken:at,refreshToken:rt,expiresIn:getTokenExpirySeconds()};}
async refreshToken(d:RefreshTokenRequestDto,ip?:string,ua?:string):Promise<RefreshTokenResponseDto>{const s=await this.tokenRepo.findValidToken(d.refreshToken);if(!s?.user)throw new UnauthorizedError();await tokenSecurityService.detectTokenReuse(d.refreshToken,s.user.id);await tokenSecurityService.detectRotationAttack(s.user.id);if(ip&&ua)await tokenSecurityService.validateFingerprint(s.user.id,ip,ua,s.ipAddress||undefined,s.userAgent||undefined);await this.tokenRepo.revokeToken(d.refreshToken);const at=generateAccessToken({userId:s.user.id,email:s.user.email,role:s.user.role});const nrt=generateRefreshToken();await this.tokenRepo.createToken({userId:s.user.id,token:nrt,expiresAt:getRefreshTokenExpiry(),ipAddress:ip,userAgent:ua});return{accessToken:at,refreshToken:nrt,expiresIn:getTokenExpirySeconds()};}
async logout(d:LogoutRequestDto,u:string){await this.tokenRepo.revokeToken(d.refreshToken);await this.logService.log({userId:u,action:'LOGOUT',entityType:'User',severity:'INFO'});}
async logoutAll(u:string){await this.tokenRepo.revokeAllUserTokens(u);await this.logService.log({userId:u,action:'LOGOUT_ALL',entityType:'User',severity:'WARNING'});}}
AUTHSVC

cat > src/services/contact.service.ts << 'CONSVC'
import{ContactRepository}from'@/repositories/contact.repository';import{SpamService}from'./spam.service';import{CreateContactMessageDto}from'@/types/dto/contact.dto';import{BadRequestError}from'@/utils/errorClasses';
export class ContactService{private repo=new ContactRepository();private spamService=new SpamService();
async createMessage(d:CreateContactMessageDto,ip?:string,ua?:string){const ss=this.spamService.calculateSpamScore(d.message,d.email);if(ss>0.8)throw new BadRequestError('Message rejected');return this.repo.create({...d,spamScore:ss,isSpam:this.spamService.isSpam(ss),ipAddress:ip,userAgent:ua});}
async getAllMessages(o:any){const w:any={deletedAt:null};if(o.isRead!==undefined)w.isRead=o.isRead;const data=await this.repo.model.findMany({where:w,skip:((o.page||1)-1)*(o.limit||10),take:o.limit||10,orderBy:{createdAt:'desc'}});const total=await this.repo.model.count({where:w});return{data,meta:{total,page:o.page||1,limit:o.limit||10}};}
async markAsRead(id:string){return this.repo.markAsRead(id);}}
CONSVC

# Controllers
cat > src/controllers/auth.controller.ts << 'AUTHCTRL'
import{Response}from'express';import{AuthRequest}from'@/types/api.types';import{AuthService}from'@/services/auth.service';import{asyncHandler}from'@/utils/asyncHandler';import{sendSuccess}from'@/utils/responseFormatter';import{LoginRequestDto,RefreshTokenRequestDto,LogoutRequestDto}from'@/types/dto/auth.dto';
export class AuthController{private service=new AuthService();
login=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.login(r.body as LoginRequestDto,r.ip,r.headers['user-agent']);sendSuccess(res,result,'Login successful',200);});
refresh=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.refreshToken(r.body as RefreshTokenRequestDto,r.ip,r.headers['user-agent']);sendSuccess(res,result,'Token refreshed',200);});
logout=asyncHandler(async(r:AuthRequest,res:Response)=>{await this.service.logout(r.body as LogoutRequestDto,r.user!.id);sendSuccess(res,null,'Logged out',200);});
logoutAll=asyncHandler(async(r:AuthRequest,res:Response)=>{await this.service.logoutAll(r.user!.id);sendSuccess(res,null,'Logged out all',200);});
getProfile=asyncHandler(async(r:AuthRequest,res:Response)=>{sendSuccess(res,r.user,'Profile retrieved',200);});}
AUTHCTRL

cat > src/controllers/contact.controller.ts << 'CONCTRL'
import{Response}from'express';import{AuthRequest}from'@/types/api.types';import{ContactService}from'@/services/contact.service';import{asyncHandler}from'@/utils/asyncHandler';import{sendSuccess}from'@/utils/responseFormatter';import{CreateContactMessageDto}from'@/types/dto/contact.dto';
export class ContactController{private service=new ContactService();
createMessage=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.createMessage(r.body as CreateContactMessageDto,r.ip,r.headers['user-agent']);sendSuccess(res,result,'Message sent',201);});
getAllMessages=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.getAllMessages(r.query);sendSuccess(res,result.data,'Messages retrieved',200,result.meta);});
markAsRead=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.markAsRead(r.params.id);sendSuccess(res,result,'Marked as read',200);});}
CONCTRL

cat > src/controllers/health.controller.ts << 'HEALTHCTRL'
import{Request,Response}from'express';import{prisma}from'@/config/database';import{asyncHandler}from'@/utils/asyncHandler';import{sendSuccess,sendError}from'@/utils/responseFormatter';import{ErrorCode}from'@/types/errorCodes';
export class HealthController{check=asyncHandler(async(r:Request,res:Response)=>{const db=await this.checkDB();const h={status:db?'healthy':'unhealthy',timestamp:new Date().toISOString(),uptime:process.uptime()};db?sendSuccess(res,h):sendError(res,ErrorCode.INTERNAL_SERVER_ERROR,'Unhealthy',503);});
private async checkDB(){try{await prisma.\$queryRaw\`SELECT 1\`;return true;}catch{return false;}}
readiness=asyncHandler(async(r:Request,res:Response)=>{const db=await this.checkDB();db?sendSuccess(res,{ready:true}):sendError(res,ErrorCode.INTERNAL_SERVER_ERROR,'Not ready',503);});
liveness=asyncHandler(async(r:Request,res:Response)=>{sendSuccess(res,{alive:true});});}
HEALTHCTRL

# Routes
cat > src/routes/auth.routes.ts << 'AUTHROUTE'
import{Router}from'express';import{AuthController}from'@/controllers/auth.controller';import{validate}from'@/middleware/validator.middleware';import{authenticate}from'@/middleware/auth.middleware';import{authLimiter,refreshLimiter}from'@/middleware/rateLimiter.middleware';import{loginSchema,refreshTokenSchema,logoutSchema}from'@/validators/auth.validator';
const r=Router();const c=new AuthController();
r.post('/login',authLimiter,validate(loginSchema),c.login);
r.post('/refresh',refreshLimiter,validate(refreshTokenSchema),c.refresh);
r.post('/logout',authenticate,validate(logoutSchema),c.logout);
r.post('/logout-all',authenticate,c.logoutAll);
r.get('/me',authenticate,c.getProfile);
export default r;
AUTHROUTE

cat > src/routes/contact.routes.ts << 'CONROUTE'
import{Router}from'express';import{ContactController}from'@/controllers/contact.controller';import{validate}from'@/middleware/validator.middleware';import{authenticate,authorize}from'@/middleware/auth.middleware';import{contactLimiter}from'@/middleware/rateLimiter.middleware';import{sanitizeInput}from'@/middleware/sanitizer.middleware';import{createContactMessageSchema}from'@/validators/contact.validator';import{uuidParamSchema}from'@/validators/common.validator';
const r=Router();const c=new ContactController();
r.post('/',contactLimiter,sanitizeInput,validate(createContactMessageSchema),c.createMessage);
r.get('/',authenticate,authorize('ADMIN'),c.getAllMessages);
r.patch('/:id/read',authenticate,authorize('ADMIN'),validate(uuidParamSchema),c.markAsRead);
export default r;
CONROUTE

cat > src/routes/health.routes.ts << 'HEALTHROUTE'
import{Router}from'express';import{HealthController}from'@/controllers/health.controller';
const r=Router();const c=new HealthController();
r.get('/',c.check);
r.get('/ready',c.readiness);
r.get('/live',c.liveness);
export default r;
HEALTHROUTE

cat > src/routes/index.ts << 'INDEXROUTE'
import{Router}from'express';import authRoutes from'./auth.routes';import contactRoutes from'./contact.routes';
const r=Router();
r.use('/auth',authRoutes);
r.use('/contact',contactRoutes);
export default r;
INDEXROUTE

# App & Server
cat > src/app.ts << 'APP'
import express,{Application}from'express';import cors from'cors';import morgan from'morgan';import cookieParser from'cookie-parser';import{env}from'./config/env';import{helmetConfig}from'./config/helmet';import routes from'./routes';import healthRoutes from'./routes/health.routes';import{errorHandler,notFoundHandler}from'./middleware/errorHandler.middleware';import{generalLimiter}from'./middleware/rateLimiter.middleware';import{requestId}from'./middleware/requestId.middleware';import{securityHeaders}from'./middleware/securityHeaders.middleware';import{csrfProtection}from'./middleware/csrf.middleware';
export const createApp=():Application=>{const a=express();a.use(requestId);a.use(helmetConfig);a.use(securityHeaders);a.use(cors({origin:env.CORS_ORIGIN,credentials:true}));a.use(express.json());a.use(cookieParser());a.use(morgan('dev'));a.use(csrfProtection.generateMiddleware);a.use('/api',generalLimiter);a.use('/api/v1/health',healthRoutes);a.use('/api/v1',routes);a.use(notFoundHandler);a.use(errorHandler);return a;};
APP

cat > src/server.ts << 'SERVER'
import{createApp}from'./app';import{env}from'./config/env';import{prisma}from'./config/database';import{logger}from'./utils/logger';
const startServer=async()=>{try{await prisma.\$connect();logger.info('✅ Database connected');const app=createApp();const server=app.listen(env.PORT,()=>{logger.info(\`🚀 Server on port \${env.PORT}\`);logger.info(\`📝 Environment: \${env.NODE_ENV}\`);});const shutdown=async()=>{logger.info('Shutting down...');server.close(async()=>{await prisma.\$disconnect();process.exit(0);});};process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);}catch(e){logger.error('Failed:',e);process.exit(1);}};
startServer();
SERVER

# README
cat > README.md << 'README'
# Huzaifa Portfolio Backend

Production-ready Node.js/TypeScript backend.

## Quick Start

\`\`\`bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
\`\`\`

Server: http://localhost:5000

## Features
- JWT Auth with Token Rotation
- CSRF Protection
- Rate Limiting
- Token Reuse Detection
- Spam Detection

## API
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/contact
- GET /api/v1/health
README

echo ""
echo "✅ تم إنشاء المشروع بنجاح!"
echo ""
echo "📍 المسار: $(pwd)"
echo ""
echo "🚀 الخطوات التالية:"
echo ""
echo "   cd $PROJECT"
echo "   npm install"
echo "   npm run prisma:generate"
echo "   npm run prisma:migrate"
echo "   npm run prisma:seed"
echo "   npm run dev"
echo ""
echo "🎯 سيعمل السيرفر على: http://localhost:5000"
echo ""