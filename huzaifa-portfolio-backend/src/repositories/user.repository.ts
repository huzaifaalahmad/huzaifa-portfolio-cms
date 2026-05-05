import{User}from'@prisma/client';import{BaseRepository}from'./base.repository';
export class UserRepository extends BaseRepository<User>{constructor(){super('user');}
async findByEmail(e:string){return this.model.findFirst({where:{email:e,deletedAt:null}});}
async updateLastLogin(u:string){return this.model.update({where:{id:u},data:{lastLoginAt:new Date()}});}}
