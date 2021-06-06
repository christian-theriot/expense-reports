import * as Models from '../models';
import * as HTTP from './http';
import { Request, Response, NextFunction } from 'express';

export namespace User {
  export async function register(req: Request, res: Response, next: NextFunction) {
    const { username, password }: { username: string; password: string } = req.body;

    if (!HTTP.validField(res, username, 'username', 'string')) {
      return next();
    }

    if (!HTTP.validField(res, password, 'password', 'string')) {
      return next();
    }

    if (HTTP.authorized(req, res)) {
      return next();
    }

    try {
      if (await HTTP.userExists(res, username, false)) {
        return next();
      }

      const user = await new Models.User({
        username,
        password
      }).save();

      HTTP.Success.CreatedResource(res, { id: user._id });
    } catch (err) {
      HTTP.Error.InternalServerError(res, err);
    }
  }

  export function login(req: Request, res: Response) {
    HTTP.Success.OK(res, { id: `${req.user!._id}`, transactions: req.user!.transactions });
  }

  export function logout(req: Request, res: Response) {
    req.logout();
    HTTP.Success.OK(res, { reason: 'User has logged out' });
  }

  export async function setTransactions(req: Request, res: Response, next: NextFunction) {
    const { transactions }: { transactions: string[] } = req.body;

    if (!HTTP.validField(res, transactions, 'transactions', 'object')) {
      return next();
    }

    if (!HTTP.authorized(req, res, true)) {
      return next();
    }

    try {
      if (!(await HTTP.userExists(res, req.user!.username, true))) {
        return next();
      }

      const user = await Models.User.findById(req.user!._id);

      user!.transactions = transactions;
      await user!.save();

      HTTP.Success.OK(res, { reason: 'Set transactions for user' });
    } catch (err) {
      HTTP.Error.InternalServerError(res);
    }
  }
}
