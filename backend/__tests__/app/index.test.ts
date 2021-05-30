import request from 'supertest';
import { App } from '../../src/app';

describe('App class', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  afterEach(() => {
    app.stop();
  });

  it('Has an http endpoint', () => {
    expect(app.http.endpoint).toBeUndefined();
    app.start();
    expect(app.http.endpoint).toBeDefined();
  });

  it('Has an https endpoint', () => {
    expect(app.https.endpoint).toBeUndefined();
    app.start(true);
    expect(app.https.endpoint).toBeDefined();
  });

  it('Has an express server', () => {
    expect(app.http.server).toBeDefined();
    expect(app.https.server).toBeDefined();
  });

  it('Has a passport object', () => {
    expect(app.passport).toBeDefined();
  });

  it('Can fetch the homepage', async () => {
    await request(app.http.server)
      .get('/')
      .expect(200)
      .then(res => {
        expect(res.text).toMatch(/div id="root"/);
      });
  });
});
