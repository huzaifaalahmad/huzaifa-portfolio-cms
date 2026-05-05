import{RefreshToken}from'@prisma/client';import{BaseRepository}from'./base.repository';
export class RefreshTokenRepository extends BaseRepository<RefreshToken>{constructor(){super('refreshToken');}
async findValidToken(t:string){return this.model.findFirst({where:{token:t,isRevoked:false,expiresAt:{gt:new Date()}},include:{user:true}});}
async revokeToken(t:string){await this.model.updateMany({where:{token:t},data:{isRevoked:true}});}
async revokeAllUserTokens(u:string){await this.model.updateMany({where:{userId:u,isRevoked:false},data:{isRevoked:true}});}
async createToken(d:any){return this.create(d);}}
