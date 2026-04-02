import { Router } from 'express';
import { categoryController } from '../controllers/CategoryController';
import { adminMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../../shared/validators';

const router = Router();

// Public routes
router.get('/', optionalAuthMiddleware, categoryController.getCategories);
router.get('/:id', optionalAuthMiddleware, categoryController.getCategory);

// Admin routes
router.post(
  '/',
  adminMiddleware,
  validateBody(createCategorySchema),
  categoryController.createCategory,
);
router.put(
  '/:id',
  adminMiddleware,
  validateBody(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete('/:id', adminMiddleware, categoryController.deleteCategory);
router.post(
  '/:id/activate',
  adminMiddleware,
  categoryController.activateCategory,
);
router.post(
  '/:id/deactivate',
  adminMiddleware,
  categoryController.deactivateCategory,
);

export default router;
