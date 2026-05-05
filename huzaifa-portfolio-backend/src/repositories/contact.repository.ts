import{ContactMessage}from'@prisma/client';import{BaseRepository}from'./base.repository';
export class ContactRepository extends BaseRepository<ContactMessage>{constructor(){super('contactMessage');}
async markAsRead(id:string){return this.model.update({where:{id},data:{isRead:true,readAt:new Date()}});}}
