import * as Controllers from '../controllers';
import { PassportStatic } from 'passport';
import { Router } from 'express';

export function User(passport: PassportStatic) {
  const user = Router();

  user.post('/register', Controllers.User.register);
  user.post('/login', passport.authenticate('local'), Controllers.User.login);
  user.post('/update', Controllers.User.setTransactions);
  user.get('/logout', Controllers.User.logout);

  return user;
}
