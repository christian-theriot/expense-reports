import { config } from 'dotenv';

config();

export namespace Constants {
  export const PORT = parseInt(`${process.env.PORT}`);
  export const SESSION_SECRET = process.env.SESSION_SECRET;
  export const SSL_KEYS_DIR = process.env.SSL_KEYS_DIR;
  export const FRONTEND = process.env.FRONTEND;
  export const DATABASE_URL = process.env.DATABASE_URL;
  export const PRODUCTION = process.env.NODE_ENV === 'production';
}
