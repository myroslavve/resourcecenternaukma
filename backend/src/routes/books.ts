import { Router } from 'express';
import { bookController } from '../controllers/BookController';
import { optionalAuthMiddleware, adminMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import {
  createBookSchema,
  updateBookSchema,
  searchBooksSchema,
} from '../../../shared/validators';

const router = Router();

// Public routes - only fetch operations
router.get('/', validateQuery(searchBooksSchema), bookController.searchBooks);
router.get('/active', optionalAuthMiddleware, bookController.getActiveBooks);
router.get('/:id', optionalAuthMiddleware, bookController.getBook);

// Admin routes - CRUD operations
router.post(
  '/',
  adminMiddleware,
  validateBody(createBookSchema),
  bookController.createBook,
);
router.put(
  '/:id',
  adminMiddleware,
  validateBody(updateBookSchema),
  bookController.updateBook,
);
router.delete('/:id', adminMiddleware, bookController.deleteBook);
router.post('/:id/activate', adminMiddleware, bookController.activateBook);
router.post('/:id/deactivate', adminMiddleware, bookController.deactivateBook);

// Admin - get all books (including inactive)
router.get('/all/list', adminMiddleware, bookController.getAllBooks);

export default router;
