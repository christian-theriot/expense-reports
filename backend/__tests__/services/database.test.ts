import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { Database } from '../../src/services';

describe('Database service', () => {
  it('Can connect and disconnect', async () => {
    jest.spyOn(mongoose, 'connect');

    await Database.connect();

    expect(mongoose.connect).toHaveBeenCalled();

    await Database.disconnect();
  });

  it('Has a store', () => {
    jest.spyOn(MongoStore, 'create');

    Database.store;

    expect(MongoStore.create).toHaveBeenCalled();
  });
});
