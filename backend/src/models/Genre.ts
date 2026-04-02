import { Schema, model } from 'mongoose';
import { Genre } from '../../../shared/types';

const genreSchema = new Schema<Genre>(
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

export const GenreModel = model<Genre>('Genre', genreSchema);
