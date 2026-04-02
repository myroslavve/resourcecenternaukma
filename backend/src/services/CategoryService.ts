import { AppError } from '../utils/apiResponse';
import { CategoryModel } from '../models/Category';
import { Category } from '../../../shared/types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/constants';

export class CategoryService {
  async createCategory(name: string, description?: string): Promise<Category> {
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        'Категорія з такою назвою вже існує',
      );
    }

    const category = new CategoryModel({ name, description });
    await category.save();
    return category.toObject() as Category;
  }

  async getCategories(): Promise<Category[]> {
    const categories = await CategoryModel.find({ isActive: true }).lean();
    return categories as Category[];
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
    return category.toObject() as Category;
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>,
  ): Promise<Category> {
    const category = await CategoryModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!category) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
    return category.toObject() as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
  }

  async activateCategory(id: string): Promise<Category> {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );
    if (!category) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
    return category.toObject() as Category;
  }

  async deactivateCategory(id: string): Promise<Category> {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!category) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
    return category.toObject() as Category;
  }
}

export const categoryService = new CategoryService();
