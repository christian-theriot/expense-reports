import { Document, Schema, model } from 'mongoose';

export enum TransactionType {
  Deposit = 'Deposit',
  Dog = 'Dog',
  Education = 'Education',
  Electricity = 'Electricity',
  Entertainment = 'Entertainment',
  Food = 'Food',
  Gas = 'Gas',
  Groceries = 'Groceries',
  Health = 'Health',
  Income = 'Income',
  Phone = 'Phone',
  Rent = 'Rent',
  Subscription = 'Subscription',
  Transfer = 'Transfer',
  Wifi = 'Wifi',
  Withdrawal = 'Withdrawal'
}

export interface ITransaction extends Document {
  name: string;
  amount: number;
  type: TransactionType[];
  date?: string;
}

export const TransactionSchema = new Schema<ITransaction>(
  {
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      set: (amount: number) => {
        if (!amount) throw new Error('Amount must be nonzero');

        return amount;
      }
    },
    type: {
      type: [String],
      required: true,
      default: []
    },
    date: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);
