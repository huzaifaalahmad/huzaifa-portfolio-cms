import { Router } from 'express';
import { SkillController } from '@/controllers/skill.controller';
import { authenticate, authorize } from '@/middleware/auth.middleware';

const router = Router();
const controller = new SkillController();

router.get('/', controller.getAll);
router.post('/', authenticate, authorize('ADMIN'), controller.create);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

export default router;