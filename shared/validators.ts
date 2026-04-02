/**
 * Validation schemas using Zod
 * Shared between frontend and backend
 */

import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserSchema = z.object({
  firstName: z.string().trim().min(2).max(50).optional(),
  lastName: z.string().trim().min(2).max(50).optional(),
  isActive: z.boolean().optional(),
  role: z.enum(['admin', 'user']).optional(),
});

// Book validation schemas
export const createBookSchema = z.object({
  title: z.string().trim().min(3).max(200),
  author: z.string().trim().min(3).max(100),
  isbn: z
    .string()
    .trim()
    .regex(/^[0-9\-]{10,17}$/),
  description: z.string().trim().max(1000).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  downloadUrl: z.string().trim().max(500).optional(),
  category: z.string().trim(),
  genre: z.string().trim(),
  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  totalCopies: z.number().int().min(1),
});

export const updateBookSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  author: z.string().trim().min(3).max(100).optional(),
  isbn: z
    .string()
    .trim()
    .regex(/^[0-9\-]{10,17}$/)
    .optional(),
  description: z.string().trim().max(1000).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  downloadUrl: z.string().trim().max(500).optional(),
  category: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  totalCopies: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const searchBooksSchema = z.object({
  query: z.string().trim().max(100).optional(),
  category: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  author: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(500).optional(),
  isActive: z.boolean().optional(),
});

// Email verification
export const emailVerificationSchema = z.object({
  token: z.string(),
  email: z.string().email(),
});
