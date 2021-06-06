import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { Database } from '../../src/services';

jest.mock('mongoose');
jest.mock('connect-mongo');

describe('Database service', () => {
  it('Can connect', async () => {
    await Database.connect();

    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('Has a store', () => {
    Database.store;

    expect(MongoStore.create).toHaveBeenCalled();
  });

  it('Can disconnect', async () => {
    await Database.disconnect();

    expect(mongoose.disconnect).toHaveBeenCalled();
  });
});
