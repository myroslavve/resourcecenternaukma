import { buildSchema, GraphQLError } from 'graphql';
import { bookService } from '../services/BookService';
import { categoryService } from '../services/CategoryService';
import { userService } from '../services/UserService';
import type {
  CreateBookDTO,
  SearchBooksDTO,
  UpdateBookDTO,
} from '../../../shared/types';
import { AppError } from '../utils/apiResponse';

interface GraphQLContext {
  userId?: string;
  user?: {
    role?: string;
  };
}

function toGraphQLError(error: unknown): GraphQLError {
  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'APP_ERROR',
        statusCode: error.statusCode,
      },
    });
  }

  if (error instanceof Error) {
    return new GraphQLError(error.message);
  }

  return new GraphQLError('Невідома помилка');
}

function requireAuth(context: GraphQLContext): void {
  if (!context.userId) {
    throw new GraphQLError('Користувач не авторизований', {
      extensions: { code: 'UNAUTHORIZED', statusCode: 401 },
    });
  }
}

function requireAdmin(context: GraphQLContext): void {
  requireAuth(context);
  if (context.user?.role !== 'admin') {
    throw new GraphQLError('Недостатньо прав доступу', {
      extensions: { code: 'FORBIDDEN', statusCode: 403 },
    });
  }
}

async function withErrorMapping<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    throw toGraphQLError(error);
  }
}

export const graphqlSchema = buildSchema(`
  type User {
    _id: ID
    email: String!
    firstName: String!
    lastName: String!
    role: String!
    isActive: Boolean!
    isEmailVerified: Boolean!
    createdAt: String
    updatedAt: String
  }

  type Book {
    _id: ID
    title: String!
    author: String!
    isbn: String!
    description: String
    category: String!
    genre: String!
    publishedYear: Int
    totalCopies: Int!
    availableCopies: Int!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }

  type Category {
    _id: ID
    name: String!
    description: String
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }

  type PaginatedBooks {
    items: [Book!]!
    total: Int!
    page: Int!
    limit: Int!
    pages: Int!
  }

  input SearchBooksInput {
    query: String
    category: String
    genre: String
    author: String
    page: Int
    limit: Int
  }

  input CreateBookInput {
    title: String!
    author: String!
    isbn: String!
    description: String
    category: String!
    genre: String!
    publishedYear: Int
    totalCopies: Int!
  }

  input UpdateBookInput {
    title: String
    author: String
    isbn: String
    description: String
    category: String
    genre: String
    publishedYear: Int
    totalCopies: Int
    availableCopies: Int
    isActive: Boolean
  }

  input CreateCategoryInput {
    name: String!
    description: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
    isActive: Boolean
  }

  type Query {
    me: User!
    books(page: Int, limit: Int): PaginatedBooks!
    activeBooks(page: Int, limit: Int): PaginatedBooks!
    book(id: ID!): Book!
    searchBooks(input: SearchBooksInput!): PaginatedBooks!
    categories: [Category!]!
    category(id: ID!): Category!
  }

  type Mutation {
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
    activateBook(id: ID!): Book!
    deactivateBook(id: ID!): Book!

    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    activateCategory(id: ID!): Category!
    deactivateCategory(id: ID!): Category!
  }
`);

export const graphqlRoot = {
  me: async (_args: unknown, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAuth(context);
      return userService.getUserById(context.userId!);
    }),

  books: async (
    args: { page?: number; limit?: number },
    _context: GraphQLContext,
  ) => withErrorMapping(() => bookService.getAllBooks(args.page, args.limit)),

  activeBooks: async (
    args: { page?: number; limit?: number },
    _context: GraphQLContext,
  ) =>
    withErrorMapping(() => bookService.getActiveBooks(args.page, args.limit)),

  book: async (args: { id: string }, _context: GraphQLContext) =>
    withErrorMapping(() => bookService.getBookById(args.id)),

  searchBooks: async (
    args: { input: SearchBooksDTO },
    _context: GraphQLContext,
  ) => withErrorMapping(() => bookService.searchBooks(args.input)),

  categories: async (_args: unknown, _context: GraphQLContext) =>
    withErrorMapping(() => categoryService.getCategories()),

  category: async (args: { id: string }, _context: GraphQLContext) =>
    withErrorMapping(() => categoryService.getCategoryById(args.id)),

  createBook: async (args: { input: CreateBookDTO }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return bookService.createBook(args.input);
    }),

  updateBook: async (
    args: { id: string; input: UpdateBookDTO },
    context: GraphQLContext,
  ) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return bookService.updateBook(args.id, args.input);
    }),

  deleteBook: async (args: { id: string }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      await bookService.deleteBook(args.id);
      return true;
    }),

  activateBook: async (args: { id: string }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return bookService.activateBook(args.id);
    }),

  deactivateBook: async (args: { id: string }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return bookService.deactivateBook(args.id);
    }),

  createCategory: async (
    args: { input: { name: string; description?: string } },
    context: GraphQLContext,
  ) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return categoryService.createCategory(
        args.input.name,
        args.input.description,
      );
    }),

  updateCategory: async (
    args: {
      id: string;
      input: { name?: string; description?: string; isActive?: boolean };
    },
    context: GraphQLContext,
  ) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return categoryService.updateCategory(args.id, args.input);
    }),

  deleteCategory: async (args: { id: string }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      await categoryService.deleteCategory(args.id);
      return true;
    }),

  activateCategory: async (args: { id: string }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return categoryService.activateCategory(args.id);
    }),

  deactivateCategory: async (args: { id: string }, context: GraphQLContext) =>
    withErrorMapping(async () => {
      requireAdmin(context);
      return categoryService.deactivateCategory(args.id);
    }),
};
