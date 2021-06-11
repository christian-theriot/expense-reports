import * as Controllers from '../controllers';
import { Auth } from '../services';
import { Router } from 'express';

export const User = Router();

User.post('/register', Controllers.User.register);
User.post('/login', Auth.service.authenticate('local'), Controllers.User.login);
User.post('/update', Controllers.User.setTransactions);
User.get('/logout', Controllers.User.logout);
User.get('/session', Controllers.User.session);
