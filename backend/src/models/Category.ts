import { Schema, model } from 'mongoose';
import { Category } from '../../../shared/types';

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const CategoryModel = model<Category>('Category', categorySchema);
