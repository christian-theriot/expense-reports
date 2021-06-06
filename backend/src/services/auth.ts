import * as Models from '../models';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express } from 'express';

export namespace Auth {
  export function setup(app: Express) {
    passport.use(
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

    passport.serializeUser(function (user: any, done) {
      done(null, user._id);
    });

    passport.deserializeUser(async function (user: any, done) {
      Models.User.findById(user)
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    app.use(passport.initialize());
    app.use(passport.session());
  }

  export const service = passport;
}
