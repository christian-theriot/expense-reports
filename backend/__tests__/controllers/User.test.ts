import { App } from '../../src/app';
import { Status } from '../utils';
import * as Models from '../../src/models';
import { Database } from '../../src/services';

describe('User API', () => {
  let app: App = new App();
  let db: Database = new Database();

  beforeAll(async () => {
    await db.connect();
    await Models.User.deleteMany({});
  });
  afterAll(async () => {
    await Models.User.deleteMany({});
    await db.disconnect();
  });
  afterEach(() => jest.clearAllMocks());

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: { output: { reason: 'username must be provided as a string' } }
  });

  Status.Error.InvalidArgument.Test({
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test' },
      output: { reason: 'password must be provided as a string' }
    }
  });

  Status.Error.Unauthorized.Test({
    before: async () =>
      jest.spyOn(Models.User, 'findOne').mockResolvedValueOnce({} as Models.IUser),
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test', password: '$Ecr3t1234' },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.CreatedResource.Test({
    then: async res => expect(res.body.id.length).toBe(24),
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test', password: '$Ecr3t1234' }
    }
  });

  Status.Error.InternalServerError.Test({
    before: async () => jest.spyOn(Models.User, 'findOne').mockRejectedValueOnce(null),
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test', password: '$Ecr3t1234' },
      output: { reason: 'Internal server error' }
    }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'POST',
    url: '/user/transactions',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.InvalidArgument.Test({
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/transactions',
    json: true,
    data: { output: { reason: 'transactions must be provided as a list of ids' } }
  });

  Status.Error.NotFound.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => {
      expect(res.body.reason).toMatch(/user with id '.{24}' could not be found/i);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/transactions',
    json: true,
    data: { input: { transactions: [] } }
  });

  Status.Success.Test({
    then: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      expect(Array.from(user ? user.transactions : [])).toEqual(['0123456789abcdefghijklmn']);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/transactions',
    json: true,
    data: {
      input: { transactions: ['0123456789abcdefghijklmn'] },
      output: { reason: 'User has been updated' }
    }
  });

  Status.Error.InternalServerError.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/transactions',
    json: true,
    data: { input: { transactions: [] }, output: { reason: 'Internal server error' } }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });

  Status.Error.InvalidArgument.Test({
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: { output: { reason: 'previous password must be provided as a string' } }
  });

  Status.Error.InvalidArgument.Test({
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: {
      input: { previous: 'invalid' },
      output: { reason: 'new password must be provided as a string' }
    }
  });

  Status.Error.NotFound.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    then: async res => {
      expect(res.body.reason).toMatch(/user with id '.{24}' could not be found/i);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: {
      input: { previous: 'invalid', current: 'invalid' }
    }
  });

  Status.Error.Unauthorized.Test({
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: {
      input: { previous: 'invalid', current: 'invalid' },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Success.Test({
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: {
      input: { previous: '$Ecr3t1234', current: '$Ecr3t1234' },
      output: { reason: 'User has been updated' }
    }
  });

  Status.Error.InternalServerError.Test({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findById').mockResolvedValueOnce(user).mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/reset-password',
    json: true,
    data: {
      input: { previous: 'invalid', current: 'invalid' },
      output: { reason: 'Internal server error' }
    }
  });

  Status.Error.Unauthorized.Test({
    app,
    method: 'POST',
    url: '/user/login',
    data: { input: { username: 'test', password: 'invalid' }, output: {} }
  });

  Status.Error.Unauthorized.Test({
    before: async () => {
      jest.spyOn(Models.User, 'findOne').mockRejectedValueOnce(null);
    },
    app,
    method: 'POST',
    url: '/user/login',
    data: { input: { username: 'test', password: 'invalid' }, output: {} }
  });

  Status.Error.InternalServerError.Test({
    before: async () => {
      jest.spyOn(Models.User, 'findById').mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/login',
    data: { input: { username: 'test', password: 'invalid' }, output: {} }
  });

  Status.Success.Test({
    app,
    method: 'GET',
    url: '/user/logout',
    json: true,
    data: {
      output: { reason: 'User has logged out' }
    }
  });
});
