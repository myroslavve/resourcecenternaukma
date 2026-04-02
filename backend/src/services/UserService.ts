import { AppError } from '../utils/apiResponse';
import { hashPassword, comparePasswords } from '../utils/password';
import { generateVerificationToken, hashToken } from '../utils/token';
import { sendEmail, generateVerificationEmailHtml } from '../utils/email';
import { UserModel } from '../models/User';
import { CreateUserDTO, LoginDTO, User, UserRole } from '../../../shared/types';
import { config } from '../config/config';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../../shared/constants';

interface VerificationTokenData {
  token: string;
  hashedToken: string;
  expiresAt: Date;
  email: string;
}

// Store verification tokens in memory (in production, use Redis or DB)
const verificationTokens = new Map<string, VerificationTokenData>();

export class UserService {
  async register(dto: CreateUserDTO): Promise<{ message: string }> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    // Create user
    const user = new UserModel({
      ...dto,
      password: hashedPassword,
      isEmailVerified: false,
      role: UserRole.USER,
    });

    await user.save();

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const hashedToken = hashToken(verificationToken);
    const expiresAt = new Date(Date.now() + config.verificationLinkExpiry);

    verificationTokens.set(hashedToken, {
      token: verificationToken,
      hashedToken,
      expiresAt,
      email: user.email,
    });

    // Send verification email
    const verificationLink = `${config.frontendUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
    const emailHtml = generateVerificationEmailHtml(
      verificationLink,
      user.firstName,
    );

    try {
      await sendEmail({
        to: user.email,
        subject:
          'Підтвердження електронної адреси - Ресурсний центр "Бібліотека"',
        html: emailHtml,
      });
    } catch (error) {
      // If email fails, still allow user to be created (they can request resend)
      console.error('Failed to send verification email:', error);
    }

    return { message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS };
  }

  async verifyEmail(
    token: string,
    email: string,
  ): Promise<{ message: string }> {
    const hashedToken = hashToken(token);
    const tokenData = verificationTokens.get(hashedToken);

    if (!tokenData || tokenData.email !== email) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (new Date() > tokenData.expiresAt) {
      verificationTokens.delete(hashedToken);
      throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Update user
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.UNAUTHORIZED);
    }

    user.isEmailVerified = true;
    await user.save();

    verificationTokens.delete(hashedToken);

    return { message: SUCCESS_MESSAGES.EMAIL_VERIFIED };
  }

  async login(dto: LoginDTO): Promise<User> {
    const user = await UserModel.findOne({ email: dto.email });

    const userPassword = user?.password;

    if (
      !user ||
      !userPassword ||
      !(await comparePasswords(dto.password, userPassword))
    ) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    if (!user.isEmailVerified) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
      );
    }

    if (!user.isActive) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, 'Акаунт деактивовано');
    }

    // Return user without password
    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj as User;
  }

  async getUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Користувач не знайдено');
    }

    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    // Don't allow password updates through this method
    delete (updates as any).password;
    delete (updates as any).email;

    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Користувач не знайдено');
    }

    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj as User;
  }

  async getVerificationTokens(): Promise<VerificationTokenData[]> {
    // Cleanup expired tokens
    const now = new Date();
    for (const [key, data] of verificationTokens.entries()) {
      if (now > data.expiresAt) {
        verificationTokens.delete(key);
      }
    }
    return Array.from(verificationTokens.values());
  }
}

export const userService = new UserService();
