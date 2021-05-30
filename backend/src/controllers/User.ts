import * as Models from '../models';
import * as Status from './status';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export class User {
  static async register(req: Request, res: Response, next: NextFunction) {
    const { username, password }: { username: string; password: string } = req.body;

    if (Status.Error.InvalidArgument(res, 'username', username, 'string')) {
      return next();
    }

    if (Status.Error.InvalidArgument(res, 'password', password, 'string')) {
      return next();
    }

    try {
      // check if user already exists
      let user = await Models.User.findOne({ username });
      if (user) {
        Status.Error.Unauthorized(res);
        return next();
      }

      // create a new user
      user = new Models.User({
        username,
        password,
        transactions: []
      });

      await user.save();

      Status.Success.CreatedResource(res, { id: `${user._id}` });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }

  static async updateTransactions(req: Request, res: Response, next: NextFunction) {
    const { transactions }: { transactions: string[] } = req.body;

    if (!req.user) {
      Status.Error.Unauthorized(res);
      return next();
    }

    if (!transactions) {
      Status.Error.InvalidArgument(res, 'transactions', null, 'list of ids');
      return next();
    }

    try {
      const user = await Models.User.findById(req.user._id);
      if (!user) {
        Status.Error.NotFound(res, `User with id '${req.user._id}'`);
        return next();
      }

      user.transactions = transactions;
      await user.save();

      Status.Success.Message(res, { reason: 'User has been updated' });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    const password: { previous: string; current: string } = req.body;

    if (!req.user) {
      Status.Error.Unauthorized(res);
      return next();
    }

    if (
      !password ||
      Status.Error.InvalidArgument(res, 'previous password', password.previous, 'string') ||
      Status.Error.InvalidArgument(res, 'new password', password.current, 'string')
    ) {
      return next();
    }

    try {
      const user = await Models.User.findById(req.user._id);
      if (!user) {
        Status.Error.NotFound(res, `User with id '${req.user._id}'`);
        return next();
      }

      if (!user.authenticate(password.previous)) {
        Status.Error.Unauthorized(res);
        return next();
      }

      user.password = password.current;
      await user.save();

      Status.Success.Message(res, { reason: 'User has been updated' });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }

  static async login(req: Request, res: Response) {
    Status.Success.Message(res, { id: `${req.user!._id}` });
  }

  static async logout(req: Request, res: Response) {
    Status.Success.Message(res, { reason: 'User has logged out' });
  }
}
