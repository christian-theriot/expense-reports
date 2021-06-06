import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Constants } from '../config';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import * as Models from '../models';
import * as Routes from '../routes';

export class App {
  private _passport: passport.PassportStatic;
  private _app: express.Express;
  private _server: {
    http?: http.Server;
    https?: https.Server;
  };

  constructor() {
    this._server = {};
    this._passport = passport;
    this._passport.use(
      new LocalStrategy(async function (username, password, done) {
        try {
          const user = await Models.User.findOne({ username });
          if (user && user.authenticate(password)) done(null, user);

          done(null, false);
        } catch (err) {
          done(err);
        }
      })
    );
    this._passport.serializeUser(function (user: any, done) {
      done(null, user._id);
    });
    this._passport.deserializeUser(async function (user: any, done) {
      Models.User.findById(user)
        .then(user => done(null, user))
        .catch(err => done(err));
    });

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
    this._app.use(this._passport.initialize());
    this._app.use(this._passport.session());
    this._app.use('/user', Routes.User(this._passport));
    this._app.use('/transaction', Routes.Transaction());
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

  get passport() {
    return this._passport;
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
