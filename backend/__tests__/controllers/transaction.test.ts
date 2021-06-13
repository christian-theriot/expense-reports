import * as Status from '../utils';
import * as Models from '../../src/models';
import { App } from '../../src/app';
import { Database } from '../../src/services';
import { TransactionType } from '../../src/models';

describe('Transaction controller', () => {
  let app = new App();

  beforeAll(async () => {
    await Database.connect();
    await Models.User.deleteMany({});
    await new Models.User({
      username: 'test',
      password: '$Ecr3t1234'
    }).save();
  });

  beforeEach(() => jest.spyOn(console, 'log').mockImplementation());
  afterEach(() => jest.restoreAllMocks());

  afterAll(async () => {
    await Models.User.deleteMany({});
    await Database.disconnect();
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { output: { reason: 'name should be a string' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { input: { name: 'name' }, output: { reason: 'amount should be a number' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', amount: 1, type: 1 },
      output: { reason: 'type should be a object' }
    }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', amount: 1, type: [], date: 1 },
      output: { reason: 'date should be a string' }
    }
  });

  Status.Error.Unauthorized({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', amount: 1 },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Success.CreatedResource({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.id).toMatch(/.{24}/),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { input: { name: 'name', amount: 1 } }
  });

  Status.Success.CreatedResource({
    then: async res => expect(res.body.id).toMatch(/.{24}/),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { input: { name: 'name', amount: 1 } }
  });

  Status.Error.InternalServerError({
    before: async () =>
      jest
        .spyOn(Models.Transaction.prototype, 'save')
        .mockRejectedValueOnce({ reason: 'Internal server error' }),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { input: { name: 'name', amount: 1 }, output: { reason: 'Internal server error' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { name: 1 }, output: { reason: 'name should be a string' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { amount: 'null' }, output: { reason: 'amount should be a number' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { type: 1 }, output: { reason: 'type should be a object' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { date: 1 }, output: { reason: 'date should be a string' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { output: { reason: 'must provide a field to update' } }
  });

  Status.Error.Unauthorized({
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: {
      input: { name: 'name' },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Error.NotFound({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/update/${user!._id}`;
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { name: 'name' }, output: { reason: 'Transaction could not be found' } }
  });

  Status.Error.NotFound({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/update/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { name: 'name' }, output: { reason: 'User could not be found' } }
  });

  Status.Error.Unauthorized({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/update/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: {
      input: { name: 'name' },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/update/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      user!.transactions.push(user!._id);
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { name: 'new name' }, output: { reason: 'Transaction has been updated' } }
  });

  Status.Error.InternalServerError({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/update/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      user!.transactions.push(user!._id);
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    },
    then: async res => expect(res.body.name).toBe('MongoError'),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update/1',
    json: true,
    data: { input: { amount: 2, type: [TransactionType.Dog], date: '2021-02-17' } }
  });

  Status.Error.Unauthorized({
    app,
    method: 'GET',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.NotFound({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'User could not be found' } }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      user!.transactions.push(user!._id);
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/1',
    json: true,
    data: { output: { name: 'name', amount: 1, type: [] } }
  });

  Status.Error.InternalServerError({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      jest
        .spyOn(Models.User, 'findById')
        .mockResolvedValueOnce(user)
        .mockRejectedValueOnce({ reason: 'Internal server error' });
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'Internal server error' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/transaction/find',
    json: true,
    data: { output: { reason: 'ids should be a object' } }
  });

  Status.Error.Unauthorized({
    app,
    method: 'POST',
    url: '/transaction/find',
    json: true,
    data: {
      input: { ids: [] },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Error.NotFound({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/find',
    json: true,
    data: {
      input: { ids: [] },
      output: { reason: 'User could not be found' }
    }
  });

  Status.Error.Unauthorized({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.ids = [user!._id];
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/find',
    json: true,
    data: {
      input: {},
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data = { input: { ids: [user!._id] } };

      jest.spyOn(Models.Transaction, 'find').mockResolvedValueOnce([
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      ]);

      user!.transactions.push(user!._id);
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    },
    then: async res => {
      const transactions = res.body.transactions;
      expect(transactions[0].id).toMatch(/.{24}/);
      expect(transactions[0].name).toBe('name');
      expect(transactions[0].amount).toBe(1);
      expect(transactions[0].type).toEqual([]);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/find',
    json: true,
    data: {}
  });

  Status.Error.InternalServerError({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest
        .spyOn(Models.User, 'findById')
        .mockResolvedValueOnce(user)
        .mockRejectedValueOnce({ reason: 'Internal server error' });
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/find',
    json: true,
    data: { input: { ids: ['id'] }, output: { reason: 'Internal server error' } }
  });

  Status.Error.Unauthorized({
    app,
    method: 'DELETE',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.NotFound({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'User could not be found' } }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(null);

      user!.transactions.push(user!._id);
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'Transaction has been deleted' } }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      user!.transactions.push(user!._id);
      jest
        .spyOn(Models.User, 'findById')
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'Transaction has been deleted' } }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      user!.transactions.push(user!._id);
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'Transaction has been deleted' } }
  });

  Status.Error.InternalServerError({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!._id}`;

      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(
        new Models.Transaction({
          _id: user!._id,
          name: 'name',
          amount: 1
        })
      );

      jest
        .spyOn(Models.User, 'findById')
        .mockResolvedValueOnce(user)
        .mockRejectedValueOnce({ reason: 'Internal server error' });
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/1',
    json: true,
    data: { output: { reason: 'Internal server error' } }
  });
});
