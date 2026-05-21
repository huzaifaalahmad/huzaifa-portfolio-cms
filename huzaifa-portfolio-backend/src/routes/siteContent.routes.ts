import { Router } from 'express';
import { SiteContentController } from '@/controllers/siteContent.controller';
import { authenticate, authorizeOwnerAdmin } from '@/middleware/auth.middleware';

const router = Router();
const controller = new SiteContentController();

router.get('/', controller.get);
router.patch('/', authenticate, authorizeOwnerAdmin, controller.update);
router.post('/cv', authenticate, authorizeOwnerAdmin, controller.uploadCv);

export default router;
