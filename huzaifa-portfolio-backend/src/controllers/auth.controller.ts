import{Response}from'express';import{AuthRequest}from'@/types/api.types';import{AuthService}from'@/services/auth.service';import{asyncHandler}from'@/utils/asyncHandler';import{sendSuccess}from'@/utils/responseFormatter';import{LoginRequestDto,RefreshTokenRequestDto,LogoutRequestDto}from'@/types/dto/auth.dto';
export class AuthController{private service=new AuthService();
login=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.login(r.body as LoginRequestDto,r.ip,r.headers['user-agent']);sendSuccess(res,result,'Login successful',200);});
refresh=asyncHandler(async(r:AuthRequest,res:Response)=>{const result=await this.service.refreshToken(r.body as RefreshTokenRequestDto,r.ip,r.headers['user-agent']);sendSuccess(res,result,'Token refreshed',200);});
logout=asyncHandler(async(r:AuthRequest,res:Response)=>{await this.service.logout(r.body as LogoutRequestDto,r.user!.id);sendSuccess(res,null,'Logged out',200);});
logoutAll=asyncHandler(async(r:AuthRequest,res:Response)=>{await this.service.logoutAll(r.user!.id);sendSuccess(res,null,'Logged out all',200);});
getProfile=asyncHandler(async(r:AuthRequest,res:Response)=>{sendSuccess(res,r.user,'Profile retrieved',200);});}
