import * as Controllers from '../controllers';
import { Router } from 'express';
import { PassportStatic } from 'passport';

export const User = (passport: PassportStatic) => {
  const user = Router();

  user.post('/register', Controllers.User.register);
  user.post('/login', passport.authenticate('local'), Controllers.User.login);
  user.post('/transactions', Controllers.User.updateTransactions);
  user.post('/reset-password', Controllers.User.updatePassword);
  user.get('/logout', Controllers.User.logout);

  return user;
};
