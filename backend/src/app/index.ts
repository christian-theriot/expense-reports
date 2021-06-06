import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Auth } from '../../src/services';
import { Constants } from '../config';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import * as Routes from '../routes';

export class App {
  private _app: express.Express;
  private _server: {
    http?: http.Server;
    https?: https.Server;
  };

  constructor() {
    this._server = {};

    this._app = express();

    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cors({ origin: `http://localhost:${Constants.PORT}`, credentials: true }));
    this._app.use(
      session({
        secret: Constants.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: Constants.SESSION_TIMEOUT }
      })
    );
    this._app.use(cookieParser());
    Auth.setup(this._app);
    this._app.use('/user', Routes.User);
    this._app.use('/transaction', Routes.Transaction);
    this._app.use(express.static(path.resolve(__dirname, '../../../frontend/build')));
    this._app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, '../../../frontend/build/index.html'));
    });
  }

  get http() {
    return {
      endpoint: this._server.http,
      server: this._app
    };
  }

  get https() {
    return {
      endpoint: this._server.https,
      server: this._app
    };
  }

  start(run_https = false) {
    this.stop();

    if (run_https) {
      this._server.https = https
        .createServer(
          {
            key: fs.readFileSync(path.join(__dirname, '../../keys/key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../../keys/cert.pem'))
          },
          this._app
        )
        .listen(Constants.PORT);
    } else {
      this._server.http = this._app.listen(Constants.PORT);
    }
  }

  stop() {
    if (this._server.http) {
      this._server.http.close();
      this._server.http = undefined;
    }

    if (this._server.https) {
      this._server.https.close();
      this._server.https = undefined;
    }
  }
}
