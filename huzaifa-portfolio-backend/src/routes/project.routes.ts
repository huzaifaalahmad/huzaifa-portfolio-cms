import { Router } from 'express';
import { ProjectController } from '@/controllers/project.controller';
import { authenticate, authorize } from '@/middleware/auth.middleware';

const router = Router();
const controller = new ProjectController();

router.get('/', controller.getAll);
router.get('/:slug', controller.getBySlug);
router.post('/', authenticate, authorize('ADMIN'), controller.create);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

export default router;