import{z}from'zod';
export const createContactMessageSchema=z.object({body:z.object({name:z.string().min(2).max(100).trim(),email:z.string().email().toLowerCase().trim(),phone:z.string().min(10).max(20).optional(),subject:z.string().min(5).max(200).trim(),message:z.string().min(10).max(5000).trim(),preferredLanguage:z.enum(['en','ar']).default('en')})});
