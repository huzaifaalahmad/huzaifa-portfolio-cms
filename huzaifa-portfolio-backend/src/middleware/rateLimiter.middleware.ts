import rateLimit from'express-rate-limit';import{RateLimitError}from'@/utils/errorClasses';import{env}from'@/config/env';
export const generalLimiter=rateLimit({windowMs:env.RATE_LIMIT_WINDOW_MS,max:env.RATE_LIMIT_MAX_REQUESTS,handler:()=>{throw new RateLimitError();}});
export const authLimiter=rateLimit({windowMs:15*60*1000,max:5,skipSuccessfulRequests:true,handler:()=>{throw new RateLimitError();}});
export const contactLimiter=rateLimit({windowMs:60*60*1000,max:3,handler:()=>{throw new RateLimitError();}});
export const refreshLimiter=rateLimit({windowMs:15*60*1000,max:10,handler:()=>{throw new RateLimitError();}});
