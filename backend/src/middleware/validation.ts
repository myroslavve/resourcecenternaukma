import { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';
import { sendErrorResponse, AppError } from '../utils/apiResponse';
import { HTTP_STATUS } from '../../../shared/constants';

function formatZodIssues(
  issues: Array<{ path: (string | number)[]; message: string }>,
): string {
  return issues
    .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
    .join(', ');
}

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = formatZodIssues(result.error.issues);

      return sendErrorResponse(
        res,
        new AppError(HTTP_STATUS.BAD_REQUEST, `Validation error: ${message}`),
      );
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = formatZodIssues(result.error.issues);

      return sendErrorResponse(
        res,
        new AppError(HTTP_STATUS.BAD_REQUEST, `Validation error: ${message}`),
      );
    }

    req.query = result.data as any;
    next();
  };
}
