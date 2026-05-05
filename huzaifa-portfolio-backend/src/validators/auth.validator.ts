import{z}from'zod';
export const loginSchema=z.object({body:z.object({email:z.string().email().toLowerCase().trim(),password:z.string().min(8)})});
export const refreshTokenSchema=z.object({body:z.object({refreshToken:z.string().min(1)})});
export const logoutSchema=z.object({body:z.object({refreshToken:z.string().min(1)})});
