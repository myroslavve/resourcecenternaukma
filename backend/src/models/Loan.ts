import { Schema, model } from 'mongoose';
import { Loan } from '../../../shared/types';

const loanSchema = new Schema<Loan>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    bookId: {
      type: String,
      required: true,
      index: true,
    },
    loanDate: {
      type: Date,
      default: () => new Date(),
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true },
);

export const LoanModel = model<Loan>('Loan', loanSchema);
