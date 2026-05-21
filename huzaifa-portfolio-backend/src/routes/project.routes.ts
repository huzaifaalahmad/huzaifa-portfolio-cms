import { Router } from 'express';
import { ProjectController } from '@/controllers/project.controller';
import { authenticate, authorizeOwnerAdmin } from '@/middleware/auth.middleware';

const router = Router();
const controller = new ProjectController();

router.get('/', controller.getAll);
router.get('/:slug', controller.getBySlug);
router.post('/', authenticate, authorizeOwnerAdmin, controller.create);
router.patch('/:id', authenticate, authorizeOwnerAdmin, controller.update);
router.delete('/:id', authenticate, authorizeOwnerAdmin, controller.delete);

export default router;
