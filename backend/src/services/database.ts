import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { Constants } from '../config';

export class Database {
  static async connect() {
    await mongoose.connect(Constants.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }

  static async disconnect() {
    await mongoose.disconnect();
  }

  static get store() {
    return MongoStore.create({
      mongoUrl: Constants.DATABASE_URL,
      mongoOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    });
  }
}
