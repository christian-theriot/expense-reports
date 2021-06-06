import { Transaction } from '../../src/models';
import { Database } from '../../src/services';

describe('Transaction model', () => {
  beforeAll(async () => {
    await Database.connect();
    await Transaction.deleteMany({});
  });

  afterAll(async () => {
    await Transaction.deleteMany({});
    await Database.disconnect();
  });

  it('Can refuse to create a transaction if amount is 0', async () => {
    try {
      await new Transaction({
        name: 'name',
        amount: 0,
        type: []
      }).save();
    } catch (err) {
      expect(err.message).toBe(
        'Transaction validation failed: amount: Cast to Number failed for value "0" (type number) at path "amount"'
      );
    }
  });

  it('Can create a transaction given a valid amount', async () => {
    const txa = await new Transaction({
      name: 'name',
      amount: 1
    }).save();

    expect(Array.from(txa.type)).toEqual([]);
  });
});
