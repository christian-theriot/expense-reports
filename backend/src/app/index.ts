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
import herokuSslRedirect from 'heroku-ssl-redirect';
import MongoStore from 'connect-mongo';

export class App {
  private _passport: passport.PassportStatic;
  private _app: express.Express;
  private _http?: http.Server;
  private _https?: https.Server;

  constructor() {
    this._passport = passport;
    this._passport.use(
      new LocalStrategy(async (username, password, done) => {
        try {
          const user = await Models.User.findOne({ username });
          if (user && user.authenticate(password)) done(null, user);

          done(null, false);
        } catch (err) {
          done(err);
        }
      })
    );
    this._passport.serializeUser((user: any, done) => done(null, user._id));
    this._passport.deserializeUser(async (user: any, done) => {
      Models.User.findById(user)
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    this._app = express();

    this._app.use(herokuSslRedirect());
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));

    this._app.use(cors({ origin: `https://expense-reports.theriot.dev`, credentials: true }));

    try {
      this._app.use(
        session({
          secret: Constants.SESSION_SECRET,
          resave: true,
          saveUninitialized: true,
          cookie: { maxAge: Constants.SESSION_TIMEOUT },
          store: MongoStore.create({
            mongoUrl: Constants.DATABASE_URL,
            mongoOptions: {
              useUnifiedTopology: true,
              useNewUrlParser: true
            }
          })
        })
      );
    } catch (err) {
      console.log(err);
      console.log(Constants.DATABASE_URL);

      this._app.use(
        session({
          secret: Constants.SESSION_SECRET,
          resave: true,
          saveUninitialized: true,
          cookie: { maxAge: Constants.SESSION_TIMEOUT }
        })
      );
    }
    this._app.use(cookieParser());

    this._app.use(this._passport.initialize());
    this._app.use(this._passport.session());

    this._app.use('/user', Routes.User(this._passport));
    this._app.use('/transaction', Routes.Transaction());

    this._app.use(express.static(Constants.FRONTEND));
    this._app.get('*', (_, res) => {
      console.log(path.resolve(__dirname, Constants.FRONTEND, 'index.html'));
      res.sendFile(path.resolve(__dirname, Constants.FRONTEND, 'index.html'));
    });
  }

  get http() {
    return {
      endpoint: this._http,
      server: this._app
    };
  }

  get https() {
    return {
      endpoint: this._https,
      server: this._app
    };
  }

  get passport() {
    return this._passport;
  }

  start(asHttps = false) {
    this.stop();

    if (asHttps) {
      this._https = https
        .createServer(
          {
            key: fs.readFileSync(path.join(__dirname, '../../keys/key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../../keys/cert.pem'))
          },
          this._app
        )
        .listen(Constants.PORT);
    } else {
      this._http = this._app.listen(Constants.PORT);
    }
  }

  stop() {
    if (this._http) {
      this._http.close();
      this._http = undefined;
    }

    if (this._https) {
      this._https.close();
      this._https = undefined;
    }
  }
}
