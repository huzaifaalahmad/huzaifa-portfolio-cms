import{Router}from'express';import{HealthController}from'@/controllers/health.controller';
const r=Router();const c=new HealthController();
r.get('/',c.check);
r.get('/ready',c.readiness);
r.get('/live',c.liveness);
export default r;
