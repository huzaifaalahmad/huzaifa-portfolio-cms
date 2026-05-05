export class AppError extends Error{public readonly statusCode:number;public readonly isOperational:boolean;constructor(m:string,s=500,o=true){super(m);this.statusCode=s;this.isOperational=o;Error.captureStackTrace(this,this.constructor);}}
export class BadRequestError extends AppError{constructor(m='Bad Request'){super(m,400);}}
export class UnauthorizedError extends AppError{constructor(m='Unauthorized'){super(m,401);}}
export class ForbiddenError extends AppError{constructor(m='Forbidden'){super(m,403);}}
export class NotFoundError extends AppError{constructor(m='Not Found'){super(m,404);}}
export class ValidationError extends AppError{public readonly details:any;constructor(m='Validation Error',d?:any){super(m,422);this.details=d;}}
export class RateLimitError extends AppError{constructor(m='Too Many Requests'){super(m,429);}}
