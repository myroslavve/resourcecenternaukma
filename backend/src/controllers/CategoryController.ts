import { Request, Response } from 'express';
import { categoryService } from '../services/CategoryService';
import { sendResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HTTP_STATUS } from '../../../shared/constants';

export class CategoryController {
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const category = await categoryService.createCategory(name, description);
    return sendResponse(
      res,
      HTTP_STATUS.CREATED,
      category,
      undefined,
      'Категорія створена',
    );
  });

  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    return sendResponse(res, HTTP_STATUS.OK, categories);
  });

  getCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return sendResponse(res, HTTP_STATUS.OK, category);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      category,
      undefined,
      'Категорія оновлена',
    );
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return sendResponse(res, HTTP_STATUS.OK, { message: 'Категорія видалена' });
  });

  activateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.activateCategory(id);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      category,
      undefined,
      'Категорія активована',
    );
  });

  deactivateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.deactivateCategory(id);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      category,
      undefined,
      'Категорія деактивована',
    );
  });
}

export const categoryController = new CategoryController();
