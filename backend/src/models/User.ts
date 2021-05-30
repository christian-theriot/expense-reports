import { Document, model, Schema, Types } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';

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
      set: (password: string) => hashSync(password, 10)
    },
    transactions: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.authenticate = function authenticate(password: string) {
  return compareSync(password, this.password);
};

export const User = model<IUser>('User', UserSchema);

// add the user._id to req.user
declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId;
    }
  }
}
