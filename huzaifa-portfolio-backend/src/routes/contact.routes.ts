import{Router}from'express';import{ContactController}from'@/controllers/contact.controller';import{validate}from'@/middleware/validator.middleware';import{authenticate,authorizeOwnerAdmin}from'@/middleware/auth.middleware';import{contactLimiter}from'@/middleware/rateLimiter.middleware';import{sanitizeInput}from'@/middleware/sanitizer.middleware';import{createContactMessageSchema}from'@/validators/contact.validator';import{uuidParamSchema}from'@/validators/common.validator';
const r=Router();const c=new ContactController();
r.post('/',contactLimiter,sanitizeInput,validate(createContactMessageSchema),c.createMessage);
r.get('/',authenticate,authorizeOwnerAdmin,c.getAllMessages);
r.patch('/:id/read',authenticate,authorizeOwnerAdmin,validate(uuidParamSchema),c.markAsRead);
r.delete('/:id',authenticate,authorizeOwnerAdmin,validate(uuidParamSchema),c.deleteMessage);
export default r;
