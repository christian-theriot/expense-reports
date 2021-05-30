import { App } from '../../src/app';
import request from 'supertest';

export interface IEndpointOptions {
  before?: (options: IEndpointOptions) => Promise<any>;
  then?: (res: request.Response) => Promise<void>;
  after?: () => void;
  app: App;
  authenticated?: boolean;
  cookie?: string;
  method: 'POST' | 'GET' | 'DELETE';
  url: string;
  json?: boolean;
  data: {
    input?: any;
    output?: any;
  };
}

export const PerformRequest = async (options: IEndpointOptions & { status: number }) => {
  if (options.before) {
    await options.before(options);
  }

  if (options.json) {
    if (options.cookie) {
      switch (options.method) {
        case 'POST':
          await request(options.app.http.server)
            .post(options.url)
            .send(options.data.input)
            .set('Cookie', options.cookie)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'GET':
          await request(options.app.http.server)
            .get(options.url)
            .set('Cookie', options.cookie)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'DELETE':
          await request(options.app.http.server)
            .delete(options.url)
            .send(options.data.input)
            .set('Cookie', options.cookie)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
      }
    } else {
      switch (options.method) {
        case 'POST':
          await request(options.app.http.server)
            .post(options.url)
            .send(options.data.input)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'GET':
          await request(options.app.http.server)
            .get(options.url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'DELETE':
          await request(options.app.http.server)
            .delete(options.url)
            .send(options.data.input)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
      }
    }
  } else {
    if (options.cookie) {
      switch (options.method) {
        case 'POST':
          await request(options.app.http.server)
            .post(options.url)
            .send(options.data.input)
            .set('Cookie', options.cookie)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'GET':
          await request(options.app.http.server)
            .get(options.url)
            .set('Cookie', options.cookie)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'DELETE':
          await request(options.app.http.server)
            .delete(options.url)
            .send(options.data.input)
            .set('Cookie', options.cookie)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
      }
    } else {
      switch (options.method) {
        case 'POST':
          await request(options.app.http.server)
            .post(options.url)
            .send(options.data.input)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'GET':
          await request(options.app.http.server)
            .get(options.url)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
        case 'DELETE':
          await request(options.app.http.server)
            .delete(options.url)
            .send(options.data.input)
            .expect(options.status)
            .then(async res => {
              if (options.data.output) {
                expect(res.body).toEqual(options.data.output);
              }

              if (options.then) {
                await options.then(res);
              }
            });
          break;
      }
    }
  }
};

export const PerformAuthenticatedRequest = async (
  options: IEndpointOptions & { status: number }
) => {
  await PerformRequest({
    then: async res => {
      expect(res.body.id).toMatch(/.{24}/i);

      options.cookie = res.headers['set-cookie'];
      await PerformRequest(options);
    },
    app: options.app,
    method: 'POST',
    url: '/user/login',
    json: true,
    status: 200,
    data: { input: { username: 'test', password: '$Ecr3t1234' } }
  });
};

export namespace Status.Success {
  export const Test = (options: IEndpointOptions) =>
    test(`${options.method} ${options.url} -> 200, ${JSON.stringify(
      options.data.output
    )}`, async () => {
      if (options.authenticated) {
        await PerformAuthenticatedRequest({ ...options, data: { ...options.data }, status: 200 });
      } else {
        await PerformRequest({ ...options, data: { ...options.data }, status: 200 });
      }
    });
}

export namespace Status.CreatedResource {
  export const Test = (options: IEndpointOptions) =>
    test(`${options.method} ${options.url} -> 201, ${JSON.stringify(
      options.data.output
    )}`, async () => {
      if (options.authenticated) {
        await PerformAuthenticatedRequest({ ...options, data: { ...options.data }, status: 201 });
      } else {
        await PerformRequest({ ...options, data: { ...options.data }, status: 201 });
      }
    });
}

export namespace Status.Error.InvalidArgument {
  export const Test = (options: IEndpointOptions) =>
    test(`${options.method} ${options.url} -> 400, ${JSON.stringify(
      options.data.output
    )}`, async () => {
      if (options.authenticated) {
        await PerformAuthenticatedRequest({ ...options, data: { ...options.data }, status: 400 });
      } else {
        await PerformRequest({ ...options, data: { ...options.data }, status: 400 });
      }
    });
}

export namespace Status.Error.Unauthorized {
  export const Test = (options: IEndpointOptions) =>
    test(`${options.method} ${options.url} -> 401, ${JSON.stringify(
      options.data.output
    )}`, async () => {
      if (options.authenticated) {
        await PerformAuthenticatedRequest({ ...options, data: { ...options.data }, status: 401 });
      } else {
        await PerformRequest({ ...options, data: { ...options.data }, status: 401 });
      }
    });
}

export namespace Status.Error.NotFound {
  export const Test = (options: IEndpointOptions) =>
    test(`${options.method} ${options.url} -> 404, ${JSON.stringify(
      options.data.output
    )}`, async () => {
      if (options.authenticated) {
        await PerformAuthenticatedRequest({ ...options, data: { ...options.data }, status: 404 });
      } else {
        await PerformRequest({ ...options, data: { ...options.data }, status: 404 });
      }
    });
}

export namespace Status.Error.InternalServerError {
  export const Test = (options: IEndpointOptions) =>
    test(`${options.method} ${options.url} -> 500, ${JSON.stringify(
      options.data.output
    )}`, async () => {
      if (options.authenticated) {
        await PerformAuthenticatedRequest({ ...options, data: { ...options.data }, status: 500 });
      } else {
        await PerformRequest({ ...options, data: { ...options.data }, status: 500 });
      }
    });
}
