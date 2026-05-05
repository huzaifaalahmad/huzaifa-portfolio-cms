export interface LoginRequestDto{email:string;password:string;}
export interface LoginResponseDto{user:{id:string;email:string;name:string;role:string;};accessToken:string;refreshToken:string;expiresIn:number;}
export interface RefreshTokenRequestDto{refreshToken:string;}
export interface RefreshTokenResponseDto{accessToken:string;refreshToken:string;expiresIn:number;}
export interface LogoutRequestDto{refreshToken:string;}
