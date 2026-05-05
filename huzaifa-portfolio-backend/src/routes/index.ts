import { Router } from 'express';
import authRoutes from './auth.routes';
import contactRoutes from './contact.routes';
import projectRoutes from './project.routes';
import skillRoutes from './skill.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);

export default router;