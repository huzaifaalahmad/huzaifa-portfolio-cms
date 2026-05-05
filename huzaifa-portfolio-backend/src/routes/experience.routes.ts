import { Router } from 'express';
import { ExperienceController } from '@/controllers/experience.controller';
import { authenticate, authorize } from '@/middleware/auth.middleware';

const router = Router();
const controller = new ExperienceController();

router.get('/', controller.getAll);
router.post('/', authenticate, authorize('ADMIN'), controller.create);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

export default router;