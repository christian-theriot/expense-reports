import * as Models from '../models';
import * as HTTP from './http';
import { Request, Response, NextFunction } from 'express';
import { userOwnsTransaction } from './http';
import { TransactionType } from '../models';

export namespace Transaction {
  export async function create(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      amount,
      type,
      date
    }: { name: string; amount: number; type?: string[]; date?: string } = req.body;

    if (!HTTP.validField(res, name, 'name', 'string')) {
      return next();
    }

    if (!HTTP.validField(res, amount, 'amount', 'number')) {
      return next();
    }

    if (type && !HTTP.validField(res, type, 'type', 'object')) {
      return next();
    }

    if (date && !HTTP.validField(res, date, 'date', 'string')) {
      return next();
    }

    if (!HTTP.authorized(req, res, true)) {
      return next();
    }

    try {
      const transaction = await new Models.Transaction({
        name,
        amount,
        type,
        date
      }).save();

      const user = await Models.User.findById(req.user!._id);
      if (user) {
        user.transactions.push(transaction._id);
        await user.save();
      }

      HTTP.Success.CreatedResource(res, { id: transaction!._id });
    } catch (err) {
      console.log({ err });
      HTTP.Error.InternalServerError(res, err);
    }
  }

  export async function update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const {
      name,
      amount,
      type,
      date
    }: { name?: string; amount?: number; type?: TransactionType[]; date?: string } = req.body;

    console.log({ id, name, amount, type, date, user: req.user });

    if (name && !HTTP.validField(res, name, 'name', 'string')) {
      return next();
    }

    if (amount && !HTTP.validField(res, amount, 'amount', 'number')) {
      return next();
    }

    if (type && !HTTP.validField(res, type, 'type', 'object')) {
      return next();
    }

    if (date && !HTTP.validField(res, date, 'date', 'string')) {
      return next();
    }

    if (!name && !amount && !type && !date) {
      HTTP.Error.BadRequest(res, 'must provide a field to update');
      return next();
    }

    if (!HTTP.authorized(req, res, true)) {
      return next();
    }

    try {
      const transaction = await Models.Transaction.findById(id);
      if (!transaction) {
        HTTP.Error.NotFound(res, { reason: 'Transaction could not be found' });
        return next();
      }

      if (!(await userOwnsTransaction(req, res, id))) {
        return next();
      }

      if (name) {
        transaction.name = name;
      }

      if (amount) {
        transaction.amount = amount;
      }

      if (type) {
        transaction.type = type;
      }

      if (date) {
        transaction.date = date;
      }

      await transaction.save();

      HTTP.Success.OK(res, { reason: 'Transaction has been updated' });
    } catch (err) {
      console.log({ err });
      HTTP.Error.InternalServerError(res, err);
    }
  }

  export async function findOne(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    if (!HTTP.authorized(req, res, true)) {
      return next();
    }

    try {
      if (!(await userOwnsTransaction(req, res, id))) {
        return next();
      }

      const transaction = await Models.Transaction.findById(id);
      HTTP.Success.OK(res, {
        name: transaction!.name,
        amount: transaction!.amount,
        type: transaction!.type,
        date: transaction!.date
      });
    } catch (err) {
      console.log({ err });
      HTTP.Error.InternalServerError(res, err);
    }
  }

  export async function findMany(req: Request, res: Response, next: NextFunction) {
    const { ids }: { ids: string[] } = req.body;

    if (!HTTP.validField(res, ids, 'ids', 'object')) {
      return next();
    }

    if (!HTTP.authorized(req, res, true)) {
      return next();
    }

    try {
      if (!(await HTTP.userOwnsTransactions(req, res, ids))) {
        return next();
      }

      const transactions = await Models.Transaction.find({ _id: ids });
      HTTP.Success.OK(res, {
        transactions: transactions.map(txa => ({
          id: `${txa._id}`,
          name: txa.name,
          amount: txa.amount,
          type: txa.type,
          date: txa.date
        }))
      });
    } catch (err) {
      console.log({ err });
      HTTP.Error.InternalServerError(res, err);
    }
  }

  export async function deleteOne(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    if (!HTTP.authorized(req, res, true)) {
      return next();
    }

    try {
      if (!(await userOwnsTransaction(req, res, id))) {
        return next();
      }

      const transaction = await Models.Transaction.findById(id);
      if (transaction) {
        await transaction.delete();

        const user = await Models.User.findById(req.user!._id);
        if (user) {
          user.transactions.splice(user.transactions.indexOf(id), 1);
          await user.save();
        }
      }

      HTTP.Success.OK(res, { reason: 'Transaction has been deleted' });
    } catch (err) {
      console.log({ err });
      HTTP.Error.InternalServerError(res, err);
    }
  }
}
