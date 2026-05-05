import{LogSeverity}from'@prisma/client';import{prisma}from'@/config/database';
interface LogEntry{userId:string;action:string;entityType:string;entityId?:string;severity:'INFO'|'WARNING'|'CRITICAL';changes?:any;ipAddress?:string;userAgent?:string;}
export class AdminLogService{async log(e:LogEntry){try{await prisma.adminLog.create({data:{...e,severity:e.severity as LogSeverity}});}catch(err){console.error('Log failed',err);}}}
