/**
 * Shared types for Library Resource Center
 * Used by both backend and frontend
 */

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  _id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  imageUrl?: string;
  category: string;
  genre: string;
  publishedYear?: number;
  totalCopies: number;
  availableCopies: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Genre {
  _id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Loan {
  _id?: string;
  userId: string;
  bookId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  createdAt?: Date;
  updatedAt?: Date;
}

// DTOs for API requests/responses
export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  imageUrl?: string;
  category: string;
  genre: string;
  publishedYear?: number;
  totalCopies: number;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  genre?: string;
  publishedYear?: number;
  totalCopies?: number;
  availableCopies?: number;
  isActive?: boolean;
}

export interface SearchBooksDTO {
  query?: string;
  category?: string;
  genre?: string;
  author?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  message: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface EmailVerificationDTO {
  token: string;
  email: string;
}
