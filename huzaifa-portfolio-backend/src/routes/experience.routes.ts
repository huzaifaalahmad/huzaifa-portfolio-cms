import { Router } from 'express';
import { ExperienceController } from '@/controllers/experience.controller';
import { authenticate, authorizeOwnerAdmin } from '@/middleware/auth.middleware';

const router = Router();
const controller = new ExperienceController();

router.get('/', controller.getAll);
router.post('/', authenticate, authorizeOwnerAdmin, controller.create);
router.patch('/:id', authenticate, authorizeOwnerAdmin, controller.update);
router.delete('/:id', authenticate, authorizeOwnerAdmin, controller.delete);

export default router;
