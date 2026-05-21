import { Router } from 'express';
import { MetricsController } from '@/controllers/metrics.controller';
import { authenticate, authorizeOwnerAdmin } from '@/middleware/auth.middleware';

const router = Router();
const controller = new MetricsController();

router.post('/visit', controller.recordVisit);
router.post('/cv-download', controller.recordCvDownload);
router.get('/summary', authenticate, authorizeOwnerAdmin, controller.summary);

export default router;
