import { App } from '../../src/app';
import { Status } from '../utils';
import * as Models from '../../src/models';
import { Database } from '../../src/services';

describe('Transaction API', () => {
  let app: App = new App();
  let db: Database = new Database();

  beforeAll(async () => {
    await db.connect();
    await Models.User.deleteMany({});
    await new Models.User({
      username: 'test',
      password: '$Ecr3t1234'
    }).save();
    await Models.Transaction.deleteMany({});
  });
  afterAll(async () => {
    await Models.User.deleteMany({});
    await db.disconnect();
  });
  afterEach(() => jest.clearAllMocks());

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { output: { reason: 'name must be provided as a string' } }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', date: 1 },
      output: { reason: 'date must be provided as a string' }
    }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name' },
      output: { reason: 'amount must be provided as a number' }
    }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', amount: 1 },
      output: { reason: 'type must be provided as a object' }
    }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', amount: 1, type: [] },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Error.NotFound.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/user with id '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { input: { name: 'name', amount: 1, type: [] } }
  });

  Status.CreatedResource.Test({
    then: async res => {
      expect(res.body.id).toMatch(/.{24}/);

      const user = await Models.User.findOne({ username: 'test' });
      expect(user?.transactions.length).toBe(1);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: { input: { name: 'name', amount: 1, type: [] } }
  });

  Status.Error.InternalServerError.Test({
    before: async () =>
      jest.spyOn(Models.Transaction.prototype, 'save').mockRejectedValueOnce(null),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/create',
    json: true,
    data: {
      input: { name: 'name', amount: 1, type: [] },
      output: { reason: 'Internal server error' }
    }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: { output: { reason: 'id must be provided as a string' } }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: 'id', name: 1 },
      output: { reason: 'name must be provided as a string' }
    }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: 'id', amount: 'amount' },
      output: { reason: 'amount must be provided as a number' }
    }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: 'id', date: 1 },
      output: { reason: 'date must be provided as a string' }
    }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: 'id' },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Error.NotFound.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/user '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: { input: { id: 'id' } }
  });

  Status.Error.Unauthorized.Test({
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: 'id' },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Error.NotFound.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.id = user!.transactions[0];
      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/transaction '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: { input: { id: '' } }
  });

  Status.Success.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.id = user!.transactions[0];
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: '', name: 'new name' },
      output: { reason: 'Transaction has been updated' }
    }
  });

  Status.Success.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.id = user!.transactions[0];
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: '', amount: 2 },
      output: { reason: 'Transaction has been updated' }
    }
  });

  Status.Success.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.id = user!.transactions[0];
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: '', type: [Models.TransactionType.Dog] },
      output: { reason: 'Transaction has been updated' }
    }
  });

  Status.Success.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.id = user!.transactions[0];
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: '', date: '2020-02-17' },
      output: { reason: 'Transaction has been updated' }
    }
  });

  Status.Error.InternalServerError.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.input.id = user!.transactions[0];
      jest.spyOn(Models.Transaction.prototype, 'save').mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/transaction/update',
    json: true,
    data: {
      input: { id: '' },
      output: { reason: 'Internal server error' }
    }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'GET',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.NotFound.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!.transactions[0]}`;
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/user '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/${id}',
    json: true,
    data: {}
  });

  Status.Error.Unauthorized.Test({
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.NotFound.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!.transactions[0]}`;
      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/transaction '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/${id}',
    json: true,
    data: {}
  });

  Status.Success.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!.transactions[0]}`;
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/${id}',
    json: true,
    data: {
      output: {
        name: 'new name',
        amount: 2,
        date: '2020-02-17',
        type: [Models.TransactionType.Dog]
      }
    }
  });

  Status.Error.InternalServerError.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'Internal server error' } }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'DELETE',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.NotFound.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!.transactions[0]}`;
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/user '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/${id}',
    json: true,
    data: {}
  });

  Status.Error.Unauthorized.Test({
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.NotFound.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!.transactions[0]}`;
      jest.spyOn(Models.Transaction, 'findById').mockResolvedValueOnce(null);
    },
    then: async res => expect(res.body.reason).toMatch(/transaction '.{24}' could not be found/i),
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/${id}',
    json: true,
    data: {}
  });

  Status.Success.Test({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.url = `/transaction/${user!.transactions[0]}`;
    },
    then: async res => {
      const user = await Models.User.findOne({ username: 'test' });
      const txas = await Models.Transaction.find({});

      expect(user!.transactions.length).toBe(0);
      expect(txas.length).toBe(0);
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'Removed resource' } }
  });

  Status.Error.InternalServerError.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'DELETE',
    url: '/transaction/${id}',
    json: true,
    data: { output: { reason: 'Internal server error' } }
  });
});
