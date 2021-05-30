import * as Models from '../models';
import * as Status from './status';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export class Transaction {
  static async create(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      date,
      amount,
      type
    }: { name: string; date?: string; amount: number; type: Models.TransactionType[] } = req.body;

    if (Status.Error.InvalidArgument(res, 'name', name, 'string')) {
      return next();
    }

    if (date && Status.Error.InvalidArgument(res, 'date', date, 'string')) {
      return next();
    }

    if (Status.Error.InvalidArgument(res, 'amount', amount, 'number')) {
      return next();
    }

    if (Status.Error.InvalidArgument(res, 'type', type, 'object')) {
      return next();
    }

    if (!req.user || !req.user._id) {
      Status.Error.Unauthorized(res);
      return next();
    }

    try {
      const user = await Models.User.findById(req.user._id);
      if (!user) {
        Status.Error.NotFound(res, `User with id '${req.user._id}'`);
        return next();
      }

      const txa = new Models.Transaction({
        name,
        amount,
        type,
        date
      });

      await txa.save();
      console.log(`Adding ${txa._id} to user ${user._id} (${user.username})`);
      user.transactions.push(`${txa._id}`);
      await user.save();

      Status.Success.CreatedResource(res, { id: `${txa._id}` });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const {
      id,
      name,
      amount,
      type,
      date
    }: {
      id: string;
      name?: string;
      amount?: number;
      type?: Models.TransactionType[];
      date?: string;
    } = req.body;

    if (Status.Error.InvalidArgument(res, 'id', id, 'string')) {
      return next();
    }

    if (name && Status.Error.InvalidArgument(res, 'name', name, 'string')) {
      return next();
    }

    if (amount && Status.Error.InvalidArgument(res, 'amount', amount, 'number')) {
      return next();
    }

    if (date && Status.Error.InvalidArgument(res, 'date', date, 'string')) {
      return next();
    }

    if (!req.user || !req.user._id) {
      Status.Error.Unauthorized(res);
      return next();
    }

    try {
      const user = await Models.User.findById(req.user._id);
      if (!user) {
        Status.Error.NotFound(res, `User '${req.user._id}'`);
        return next();
      }

      if (!user.transactions || !user.transactions.find(txa => txa == id)) {
        console.log({
          userTransactions: user.transactions,
          idNotFound: id
        });
        Status.Error.Unauthorized(res);
        return next();
      }

      const txa = await Models.Transaction.findById(Types.ObjectId(id));
      if (!txa) {
        Status.Error.NotFound(res, `Transaction '${id}'`);
        return next();
      }

      if (name) {
        txa.name = name;
      }

      if (amount) {
        txa.amount = amount;
      }

      if (type) {
        txa.type = type;
      }

      if (date) {
        txa.date = date;
      }

      await txa.save();
      Status.Success.Message(res, { reason: 'Transaction has been updated' });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }

  static async find(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    if (!req.user || !req.user._id) {
      Status.Error.Unauthorized(res);
      return next();
    }

    try {
      const user = await Models.User.findById(req.user._id);
      if (!user) {
        Status.Error.NotFound(res, `User '${req.user._id}'`);
        return next();
      }

      if (!user.transactions || !user.transactions.find(txa => txa == id)) {
        console.log({
          userTransactions: user.transactions,
          idNotFound: id
        });
        Status.Error.Unauthorized(res);
        return next();
      }

      const txa = await Models.Transaction.findById(Types.ObjectId(id));
      if (!txa) {
        Status.Error.NotFound(res, `Transaction '${id}'`);
        return next();
      }

      Status.Success.Message(res, {
        name: txa.name,
        amount: txa.amount,
        date: txa.date,
        type: txa.type
      });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    if (!req.user || !req.user._id) {
      console.log(id);
      Status.Error.Unauthorized(res);
      return next();
    }

    try {
      const user = await Models.User.findById(req.user._id);
      if (!user) {
        Status.Error.NotFound(res, `User '${req.user._id}'`);
        return next();
      }

      if (!user.transactions || !user.transactions.find(txa => txa == id)) {
        console.log({
          userTransactions: user.transactions,
          idNotFound: id
        });
        Status.Error.Unauthorized(res);
        return next();
      }

      const txa = await Models.Transaction.findById(Types.ObjectId(id));
      if (!txa) {
        Status.Error.NotFound(res, `Transaction '${id}'`);
        return next();
      }

      user.transactions = user.transactions.filter(txa => txa != id);
      await user.save();
      await Models.Transaction.findByIdAndDelete(id);
      Status.Success.Message(res, { reason: 'Removed resource' });
    } catch (err) {
      console.log({ err });
      Status.Error.InternalServerError(res);
    }
  }
}
