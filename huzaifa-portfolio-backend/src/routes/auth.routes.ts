import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middleware/validator.middleware';
import { authenticate } from '@/middleware/auth.middleware';
import { authLimiter, refreshLimiter } from '@/middleware/rateLimiter.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '@/validators/auth.validator';

const router = Router();
const controller = new AuthController();

router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', refreshLimiter, validate(refreshTokenSchema), controller.refresh);
router.post('/logout', authenticate, validate(logoutSchema), controller.logout);
router.post('/logout-all', authenticate, controller.logoutAll);
router.get('/me', authenticate, controller.getProfile);

export default router;