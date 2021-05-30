import mongoose from 'mongoose';
import { Constants } from '../config';

export class Database {
  async connect() {
    await mongoose.connect(Constants.DATABASE_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}
