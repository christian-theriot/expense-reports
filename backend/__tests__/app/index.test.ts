import * as Models from '../../src/models';
import { App } from '../../src/app';
import { makeRequest } from '../utils';
import { Database } from '../../src/services';

describe('App class', () => {
  let app: App;

  beforeAll(async () => {
    await Database.connect();
    await Models.User.deleteMany({});
    await new Models.User({
      username: 'test',
      password: '$Ecr3t1234'
    }).save();
  });

  beforeEach(() => {
    app = new App();
  });

  afterEach(() => {
    app.stop();
  });

  afterAll(async () => {
    await Models.User.deleteMany({});
    await Database.disconnect();
  });

  it('Can start listening to a port in http', () => {
    app.start();
  });

  it('Can start listening to a port in https', () => {
    app.start(true);
  });

  it('Has an http getter', () => {
    expect(app.http).toBeDefined();
  });

  it('Has an https getter', () => {
    expect(app.https).toBeDefined();
  });

  it('Can request another page to render the frontend', async () => {
    await makeRequest({
      then: async res => expect(res.text).toMatch(/<div id="root">/i),
      app,
      method: 'GET',
      url: '/login',
      status: 200,
      data: {}
    });
  });

  it('Can fail to login', async () => {
    await makeRequest({
      before: async () => jest.spyOn(Models.User, 'findOne').mockRejectedValueOnce(null),
      app,
      method: 'POST',
      url: '/user/login',
      status: 401,
      data: { input: { username: 'test', password: 'invalid' } }
    });
  });

  it('Can fail to deserialize the user', async () => {
    await makeRequest({
      before: async () => jest.spyOn(Models.User, 'findById').mockRejectedValue(null),
      app,
      method: 'POST',
      url: '/user/login',
      status: 200,
      data: { input: { username: 'test', password: '$Ecr3t1234' } },
      then: async res => {
        await makeRequest({
          then: async res => expect(res.body.id).toBeUndefined(),
          cookie: res.headers['set-cookie'],
          app,
          method: 'POST',
          url: '/user/update',
          status: 500,
          data: {
            input: { transactions: [] },
            output: {}
          }
        });
      }
    });
  });
});
