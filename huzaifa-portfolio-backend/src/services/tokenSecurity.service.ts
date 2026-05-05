import{prisma}from'@/config/database';import{UnauthorizedError}from'@/utils/errorClasses';
export class TokenSecurityService{private tokenUsageMap:Map<string,{count:number}>=new Map();
async detectTokenReuse(t:string,u:string){const us=this.tokenUsageMap.get(t);if(!us){this.tokenUsageMap.set(t,{count:1});return;}if(us.count>=1){await this.revokeAllUserTokens(u);throw new UnauthorizedError('Token reuse detected');}us.count++;}
async validateFingerprint(u:string,ci:string,cu:string,si?:string,su?:string){if(!si||!su)return;if(ci!==si&&cu!==su)throw new UnauthorizedError('Fingerprint mismatch');}
async detectRotationAttack(u:string){const r=await prisma.refreshToken.findMany({where:{userId:u,createdAt:{gte:new Date(Date.now()-5*60*1000)}}});if(r.length>5){await this.revokeAllUserTokens(u);throw new UnauthorizedError('Rotation attack');}}
private async revokeAllUserTokens(u:string){await prisma.refreshToken.updateMany({where:{userId:u},data:{isRevoked:true}});}}
export const tokenSecurityService=new TokenSecurityService();
