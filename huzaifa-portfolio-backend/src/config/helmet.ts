import helmet from'helmet';
export const helmetConfig=helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"]}},hsts:{maxAge:31536000,includeSubDomains:true}});
