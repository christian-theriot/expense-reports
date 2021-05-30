import mongoose from 'mongoose';
import { Constants } from '../../src/config';
import { Database } from '../../src/services';

describe('Database service', () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
  });

  afterEach(async () => {
    await db.disconnect();
  });

  it('Connects to the database successfully', async () => {
    jest.spyOn(mongoose, 'connect');

    await db.connect();

    expect(mongoose.connect).toBeCalled();
  });

  it('Disconnects from the database successfully', async () => {
    jest.spyOn(mongoose, 'disconnect');

    await db.disconnect();

    expect(mongoose.disconnect).toBeCalled();
  });
});
