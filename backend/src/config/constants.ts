import { config } from 'dotenv';

config();

export namespace Constants {
  export const PORT = parseInt(`${process.env.PORT}`);
  export const SESSION_SECRET = `${process.env.SESSION_SECRET}`;
  export const DATABASE_URL = `${process.env.DATABASE_URL}`;
  export const PRODUCTION = `${process.env.NODE_ENV}` === 'production';
  export const SESSION_TIMEOUT = 1000 * 60 * 60 * 24;
}
