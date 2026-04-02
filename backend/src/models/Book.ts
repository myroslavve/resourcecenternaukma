import { Schema, model } from 'mongoose';
import { Book } from '../../../shared/types';

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    publishedYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

bookSchema.index(
  { title: 'text', author: 'text', isbn: 'text' },
  { weights: { title: 5, author: 3, isbn: 2 }, name: 'book_text_search_idx' },
);

bookSchema.index(
  { isActive: 1, category: 1, genre: 1 },
  { name: 'book_active_category_genre_idx' },
);

export const BookModel = model<Book>('Book', bookSchema);
