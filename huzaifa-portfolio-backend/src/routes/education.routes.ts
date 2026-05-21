import { Router } from 'express';
import { EducationController } from '@/controllers/education.controller';
import { authenticate, authorizeOwnerAdmin } from '@/middleware/auth.middleware';

const router = Router();
const controller = new EducationController();

router.get('/', controller.getAll);

router.post('/', authenticate, authorizeOwnerAdmin, controller.createEducation);
router.post('/certifications', authenticate, authorizeOwnerAdmin, controller.createCertification);
router.patch('/:id', authenticate, authorizeOwnerAdmin, controller.updateEducation);
router.patch('/certifications/:id', authenticate, authorizeOwnerAdmin, controller.updateCertification);

router.delete('/:id', authenticate, authorizeOwnerAdmin, controller.deleteEducation);
router.delete('/certifications/:id', authenticate, authorizeOwnerAdmin, controller.deleteCertification);

export default router;
