import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import {
  createUserSchema,
  loginSchema,
  emailVerificationSchema,
} from '../../../shared/validators';

const router = Router();

// Public routes
router.post(
  '/register',
  validateBody(createUserSchema),
  authController.register,
);
router.post('/login', validateBody(loginSchema), authController.login);
router.post(
  '/verify-email',
  validateBody(emailVerificationSchema),
  authController.verifyEmail,
);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
