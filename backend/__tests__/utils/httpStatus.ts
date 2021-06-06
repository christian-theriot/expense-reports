import { IMakeRequestOptions, makeRequest } from './makeRequest';

const makeRequestOrAuthenticatedRequest = (options: IMakeRequestOptions) =>
  test(`${options.method} ${options.url} -> ${options.status}${
    options.data.output ? ` (${JSON.stringify(options.data.output)})` : ''
  }`, async () => {
    if (options.authenticated) {
      await makeRequest({
        app: options.app,
        method: 'POST',
        url: '/user/login',
        json: true,
        status: 200,
        data: {
          input: { username: 'test', password: '$Ecr3t1234' }
        },
        then: async res => {
          expect(res.body.id).toMatch(/.{24}/);

          options.cookie = res.headers['set-cookie'];

          await makeRequest(options);
        }
      });
    } else {
      await makeRequest(options);
    }
  });

export namespace Success {
  export const OK = (options: Partial<IMakeRequestOptions>) => {
    options.status = 200;
    makeRequestOrAuthenticatedRequest(<IMakeRequestOptions>options);
  };

  export const CreatedResource = (options: Partial<IMakeRequestOptions>) => {
    options.status = 201;
    makeRequestOrAuthenticatedRequest(<IMakeRequestOptions>options);
  };
}

export namespace Error {
  export const BadRequest = (options: Partial<IMakeRequestOptions>) => {
    options.status = 400;
    makeRequestOrAuthenticatedRequest(<IMakeRequestOptions>options);
  };

  export const Unauthorized = (options: Partial<IMakeRequestOptions>) => {
    options.status = 401;
    makeRequestOrAuthenticatedRequest(<IMakeRequestOptions>options);
  };

  export const NotFound = (options: Partial<IMakeRequestOptions>) => {
    options.status = 404;
    makeRequestOrAuthenticatedRequest(<IMakeRequestOptions>options);
  };

  export const InternalServerError = (options: Partial<IMakeRequestOptions>) => {
    options.status = 500;
    makeRequestOrAuthenticatedRequest(<IMakeRequestOptions>options);
  };
}
