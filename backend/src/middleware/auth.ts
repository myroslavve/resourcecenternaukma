import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiResponse';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/constants';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session?.userId) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }

  req.userId = req.session.userId;
  req.user = req.session.user;
  next();
}

export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.session?.userId) {
    req.userId = req.session.userId;
    req.user = req.session.user;
  }
  next();
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session?.userId) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }

  if (req.session.user?.role !== 'admin') {
    throw new AppError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
  }

  req.userId = req.session.userId;
  req.user = req.session.user;
  next();
}
