import { Response } from 'express';
import { HTTP_STATUS } from '../../../shared/constants';
import { ApiResponse } from '../../../shared/types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  data?: T,
  error?: string,
  message?: string,
): Response {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    ...(data && { data }),
    ...(error && { error }),
  };

  return res.status(statusCode).json(response);
}

export function sendErrorResponse(
  res: Response,
  error: Error | AppError,
  defaultStatusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): Response {
  const statusCode =
    error instanceof AppError ? error.statusCode : defaultStatusCode;

  const message =
    error instanceof AppError
      ? error.message
      : process.env.NODE_ENV === 'production'
        ? 'Внутрішня помилка сервера'
        : error.message;

  return sendResponse(res, statusCode, undefined, message);
}
