import { Router } from 'express';
import { EducationController } from '@/controllers/education.controller';
import { authenticate, authorize } from '@/middleware/auth.middleware';

const router = Router();
const controller = new EducationController();

router.get('/', controller.getAll);

router.post('/', authenticate, authorize('ADMIN'), controller.createEducation);
router.post('/certifications', authenticate, authorize('ADMIN'), controller.createCertification);

router.delete('/:id', authenticate, authorize('ADMIN'), controller.deleteEducation);
router.delete('/certifications/:id', authenticate, authorize('ADMIN'), controller.deleteCertification);

export default router;