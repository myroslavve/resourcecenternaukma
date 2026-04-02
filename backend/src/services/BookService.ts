import { AppError } from '../utils/apiResponse';
import { BookModel } from '../models/Book';
import { CategoryModel } from '../models/Category';
import {
  Book,
  CreateBookDTO,
  UpdateBookDTO,
  SearchBooksDTO,
  PaginatedResponse,
} from '../../../shared/types';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../../shared/constants';

export class BookService {
  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async resolveActiveCategoryName(category: string): Promise<string> {
    const normalized = category.trim();
    const existingCategory = await CategoryModel.findOne({
      name: { $regex: `^${this.escapeRegex(normalized)}$`, $options: 'i' },
      isActive: true,
    }).lean();

    if (!existingCategory) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Категорія не існує або деактивована',
      );
    }

    return existingCategory.name;
  }

  async createBook(dto: CreateBookDTO): Promise<Book> {
    const categoryName = await this.resolveActiveCategoryName(dto.category);

    // Check if book with same ISBN exists
    const existingBook = await BookModel.findOne({ isbn: dto.isbn });
    if (existingBook) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'Книга з таким ISBN вже існує');
    }

    const book = new BookModel({
      ...dto,
      category: categoryName,
      isActive: true,
    });

    await book.save();
    return book.toObject() as Book;
  }

  async getBookById(id: string): Promise<Book> {
    const book = await BookModel.findById(id);
    if (!book) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    return book.toObject() as Book;
  }

  async updateBook(id: string, dto: UpdateBookDTO): Promise<Book> {
    if (dto.category) {
      dto.category = await this.resolveActiveCategoryName(dto.category);
    }

    // Check ISBN uniqueness if ISBN is being updated
    if (dto.isbn) {
      const existingBook = await BookModel.findOne({
        isbn: dto.isbn,
        _id: { $ne: id },
      });
      if (existingBook) {
        throw new AppError(
          HTTP_STATUS.CONFLICT,
          'Книга з таким ISBN вже існує',
        );
      }
    }

    const book = await BookModel.findByIdAndUpdate(id, dto, { new: true });
    if (!book) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.BOOK_NOT_FOUND);
    }

    return book.toObject() as Book;
  }

  async deleteBook(id: string): Promise<void> {
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
  }

  async activateBook(id: string): Promise<Book> {
    const book = await BookModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );
    if (!book) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    return book.toObject() as Book;
  }

  async deactivateBook(id: string): Promise<Book> {
    const book = await BookModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!book) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    return book.toObject() as Book;
  }

  async searchBooks(dto: SearchBooksDTO): Promise<PaginatedResponse<Book>> {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { isActive: true };

    if (dto.query) {
      filter.$or = [
        { title: { $regex: dto.query, $options: 'i' } },
        { author: { $regex: dto.query, $options: 'i' } },
        { isbn: { $regex: dto.query, $options: 'i' } },
      ];
    }

    if (dto.category) {
      filter.category = { $regex: dto.category, $options: 'i' };
    }

    if (dto.genre) {
      filter.genre = { $regex: dto.genre, $options: 'i' };
    }

    if (dto.author) {
      filter.author = { $regex: dto.author, $options: 'i' };
    }

    // Execute query
    const [books, total] = await Promise.all([
      BookModel.find(filter).limit(limit).skip(skip).lean(),
      BookModel.countDocuments(filter),
    ]);

    return {
      items: books as Book[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getAllBooks(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Book>> {
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      BookModel.find({}).limit(limit).skip(skip).lean(),
      BookModel.countDocuments({}),
    ]);

    return {
      items: books as Book[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getActiveBooks(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Book>> {
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      BookModel.find({ isActive: true }).limit(limit).skip(skip).lean(),
      BookModel.countDocuments({ isActive: true }),
    ]);

    return {
      items: books as Book[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}

export const bookService = new BookService();
