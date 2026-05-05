import{Response}from'express';import{AuthRequest}from'@/types/api.types';import{ContactService}from'@/services/contact.service';import{asyncHandler}from'@/utils/asyncHandler';import{sendSuccess}from'@/utils/responseFormatter';import{CreateContactMessageDto}from'@/types/dto/contact.dto';
export class ContactController{private service=new ContactService();
createMessage=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.createMessage(r.body as CreateContactMessageDto,r.ip,r.headers['user-agent']);sendSuccess(res,result,'Message sent',201);});
getAllMessages=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.getAllMessages(r.query);sendSuccess(res,result.data,'Messages retrieved',200,result.meta);});
markAsRead=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.markAsRead(r.params.id);sendSuccess(res,result,'Marked as read',200);});}
