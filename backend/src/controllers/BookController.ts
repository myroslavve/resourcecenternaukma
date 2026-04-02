import { Request, Response } from 'express';
import { bookService } from '../services/BookService';
import { sendResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants';

export class BookController {
  createBook = asyncHandler(async (req: Request, res: Response) => {
    const book = await bookService.createBook(req.body);
    return sendResponse(
      res,
      HTTP_STATUS.CREATED,
      book,
      undefined,
      SUCCESS_MESSAGES.BOOK_CREATED,
    );
  });

  getBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    return sendResponse(res, HTTP_STATUS.OK, book);
  });

  updateBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookService.updateBook(id, req.body);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      book,
      undefined,
      SUCCESS_MESSAGES.BOOK_UPDATED,
    );
  });

  deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await bookService.deleteBook(id);
    return sendResponse(res, HTTP_STATUS.OK, {
      message: SUCCESS_MESSAGES.BOOK_DELETED,
    });
  });

  searchBooks = asyncHandler(async (req: Request, res: Response) => {
    const result = await bookService.searchBooks(req.query as any);
    return sendResponse(res, HTTP_STATUS.OK, result);
  });

  getAllBooks = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await bookService.getAllBooks(page, limit);
    return sendResponse(res, HTTP_STATUS.OK, result);
  });

  getActiveBooks = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await bookService.getActiveBooks(page, limit);
    return sendResponse(res, HTTP_STATUS.OK, result);
  });

  activateBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookService.activateBook(id);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      book,
      undefined,
      SUCCESS_MESSAGES.BOOK_ACTIVATED,
    );
  });

  deactivateBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const book = await bookService.deactivateBook(id);
    return sendResponse(
      res,
      HTTP_STATUS.OK,
      book,
      undefined,
      SUCCESS_MESSAGES.BOOK_DEACTIVATED,
    );
  });
}

export const bookController = new BookController();
