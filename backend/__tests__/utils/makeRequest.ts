import supertest from 'supertest';
import { App } from '../../src/app';

export interface IMakeRequestOptions {
  before?: (options: IMakeRequestOptions) => Promise<any>;
  then?: (res: supertest.Response) => Promise<any>;
  after?: () => Promise<any>;
  authenticated?: boolean;
  app: App;
  method: 'POST' | 'GET' | 'DELETE';
  url: string;
  cookie?: string;
  json?: boolean;
  data: {
    input?: any;
    output?: any;
  };
  status: number;
}

export async function makeRequest(options: IMakeRequestOptions) {
  if (options.before) {
    await options.before(options);
  }

  if (options.json) {
    if (options.cookie) {
      switch (options.method) {
        case 'DELETE':
          await supertest(options.app.http.server)
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
        case 'GET':
          await supertest(options.app.http.server)
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
        case 'POST':
          await supertest(options.app.http.server)
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
      }
    } else {
      switch (options.method) {
        case 'DELETE':
          await supertest(options.app.http.server)
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
        case 'GET':
          await supertest(options.app.http.server)
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
        case 'POST':
          await supertest(options.app.http.server)
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
      }
    }
  } else {
    if (options.cookie) {
      switch (options.method) {
        case 'DELETE':
          await supertest(options.app.http.server)
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
        case 'GET':
          await supertest(options.app.http.server)
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
        case 'POST':
          await supertest(options.app.http.server)
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
      }
    } else {
      switch (options.method) {
        case 'DELETE':
          await supertest(options.app.http.server)
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
        case 'GET':
          await supertest(options.app.http.server)
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
        case 'POST':
          await supertest(options.app.http.server)
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
      }
    }
  }

  if (options.after) {
    await options.after();
  }
}
