import { Document, Schema, model, Types } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';

export function validatePassword(password: string): { valid: boolean; reason?: string } {
  for (let { regex, reason } of [
    { regex: /[a-z]/, reason: 'Password must have a lowercase letter' },
    { regex: /[A-Z]/, reason: 'Password must have an uppercase letter' },
    { regex: /[0-9]/, reason: 'Password must have a number' },
    { regex: /[^a-zA-Z0-9]/, reason: 'Password must have a special character' },
    { regex: /.{10,32}/, reason: 'Password must be between 24 and 32 characters' }
  ]) {
    if (!regex.test(password)) {
      return { valid: false, reason };
    }
  }

  return { valid: true };
}

export interface IUser extends Document {
  username: string;
  password: string;
  transactions: string[];

  authenticate: (password: string) => boolean;
}

export const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      set: (password: string) => {
        const result = validatePassword(password);

        if (!result.valid) throw new Error(result.reason);

        return hashSync(password, 10);
      }
    },
    transactions: {
      type: [String],
      required: true,
      default: []
    }
  },
  { timestamps: true }
);

UserSchema.methods.authenticate = function (password: string) {
  return compareSync(password, this.password);
};

export const User = model<IUser>('User', UserSchema);

declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId;
      username: string;
      transactions: string[];
    }
  }
}
