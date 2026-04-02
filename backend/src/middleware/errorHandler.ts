import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse, AppError } from '../utils/apiResponse';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  console.error('Error:', err);

  return sendErrorResponse(res, err);
}
