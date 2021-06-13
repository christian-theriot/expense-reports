import * as Status from '../utils';
import * as Models from '../../src/models';
import { App } from '../../src/app';
import { Database } from '../../src/services';
import { makeRequest } from '../utils';

describe('User controller', () => {
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

  afterAll(async () => {
    await Models.User.deleteMany({});
    await Database.disconnect();
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: { output: { reason: 'username should be a string' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test' },
      output: { reason: 'password should be a string' }
    }
  });

  Status.Error.BadRequest({
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test', password: 'invalid' },
      output: { reason: 'User should not be authorized to perform this action' }
    }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: {
      input: { username: 'test', password: 'invalid' },
      output: { reason: 'User already exists' }
    }
  });

  Status.Success.CreatedResource({
    then: async res => expect(res.body.id).toMatch(/.{24}/),
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: { input: { username: 'new', password: '$Ecr3t1234' } }
  });

  Status.Error.InternalServerError({
    then: async res => {
      expect(res.body.message).toMatch(/user validation failed/i);
    },
    app,
    method: 'POST',
    url: '/user/register',
    json: true,
    data: { input: { username: 'invalid', password: 'invalid' } }
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/user/login',
    data: {}
  });

  Status.Error.Unauthorized({
    app,
    method: 'POST',
    url: '/user/login',
    data: { input: { username: 'test', password: 'invalid' } }
  });

  Status.Success.OK({
    then: async res => expect(res.body.id).toMatch(/.{24}/),
    app,
    method: 'POST',
    url: '/user/login',
    json: true,
    data: { input: { username: 'test', password: '$Ecr3t1234' } }
  });

  Status.Success.OK({
    app,
    method: 'GET',
    url: '/user/logout',
    json: true,
    data: { output: { reason: 'User has logged out' } }
  });

  Status.Success.OK({
    then: async res => {
      await makeRequest({
        then: async res => {
          expect(res.body.message).toMatch(/user validation failed/i);
        },
        cookie: res.headers['set-cookie'],
        app,
        method: 'POST',
        url: '/user/register',
        status: 500,
        data: {
          input: { username: 'invalid', password: 'invalid' }
        }
      });
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/user/logout',
    json: true,
    data: {}
  });

  Status.Error.BadRequest({
    app,
    method: 'POST',
    url: '/user/update',
    json: true,
    data: { output: { reason: 'transactions should be a object' } }
  });

  Status.Error.Unauthorized({
    app,
    method: 'POST',
    url: '/user/update',
    json: true,
    data: {
      input: { transactions: [] },
      output: { reason: 'User is unauthorized to perform this action' }
    }
  });

  Status.Error.NotFound({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findOne').mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/update',
    json: true,
    data: { input: { transactions: [] }, output: { reason: 'User could not be found' } }
  });

  Status.Success.OK({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      expect(Array.from(user!.transactions)).toEqual([]);
    },
    after: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      expect(Array.from(user!.transactions)).toEqual(['id']);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/update',
    json: true,
    data: { input: { transactions: ['id'] }, output: { reason: 'Set transactions for user' } }
  });

  Status.Error.InternalServerError({
    before: async () => {
      const user = await Models.User.findOne({ username: 'test' });
      jest.spyOn(Models.User, 'findOne').mockResolvedValueOnce(user).mockRejectedValueOnce(null);
    },
    authenticated: true,
    app,
    method: 'POST',
    url: '/user/update',
    json: true,
    data: { input: { transactions: [] }, output: { reason: 'Internal server error' } }
  });

  Status.Success.OK({
    before: async options => {
      const user = await Models.User.findOne({ username: 'test' });
      options.data.output = {
        id: `${user!._id}`,
        username: 'test',
        transactions: Array.from(user!.transactions)
      };
    },
    authenticated: true,
    app,
    method: 'GET',
    url: '/user/session',
    json: true,
    data: { output: { id: 'id', username: 'test', transactions: [] } }
  });

  Status.Error.Unauthorized({
    app,
    method: 'GET',
    url: '/user/session',
    json: true,
    data: { output: { reason: 'User is unauthorized to perform this action' } }
  });
});
