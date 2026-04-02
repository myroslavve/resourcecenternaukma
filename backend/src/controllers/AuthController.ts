import { Request, Response } from 'express';
import { userService } from '../services/UserService';
import { sendResponse, AppError } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants';
import { SESSION_MAX_AGE } from '../../../shared/constants';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.register(req.body);
    return sendResponse(
      res,
      HTTP_STATUS.CREATED,
      result,
      undefined,
      result.message,
    );
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token, email } = req.body;
    const result = await userService.verifyEmail(token, email);
    return sendResponse(res, HTTP_STATUS.OK, result, undefined, result.message);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.login(req.body);

    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err: Error | null) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Create session
    req.session!.userId = user._id;
    req.session!.user = user;
    req.session!.cookie.maxAge = SESSION_MAX_AGE;

    return sendResponse(res, HTTP_STATUS.OK, {
      user,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
      req.session?.destroy((err: Error | null) => {
        if (err) {
          return reject(err);
        }
        res.clearCookie('library.sid');
        sendResponse(res, HTTP_STATUS.OK, {
          message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
        });
        resolve(null);
      });
    });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        'Користувач не знайдено в сесії',
      );
    }

    const user = await userService.getUserById(req.userId);
    return sendResponse(res, HTTP_STATUS.OK, user);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        'Користувач не авторизований',
      );
    }

    const user = await userService.updateUser(req.userId, req.body);
    req.session!.user = user;

    return sendResponse(res, HTTP_STATUS.OK, {
      user,
      message: 'Профіль оновлено',
    });
  });
}

export const authController = new AuthController();
