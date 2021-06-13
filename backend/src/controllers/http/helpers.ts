import { Error } from './status';
import * as Models from '../../models';
import { Request, Response } from 'express';

export function validField(res: Response, field: any, fieldName: string, type: string) {
  if (!field || typeof field !== type) {
    Error.BadRequest(res, `${fieldName} should be a ${type}`);
    return false;
  }

  return true;
}

export function authorized(req: Request, res: Response, shouldAuthorize?: boolean) {
  if (!req.user?._id) {
    if (shouldAuthorize) {
      Error.Unauthorized(res);
    }

    return false;
  }

  if (!shouldAuthorize) {
    Error.BadRequest(res, 'User should not be authorized to perform this action');
  }

  return true;
}

export async function userExists(res: Response, username: string, shouldExist?: boolean) {
  const user = await Models.User.findOne({ username });
  if (user) {
    if (!shouldExist) {
      Error.BadRequest(res, 'User already exists');
    }

    return true;
  }

  if (shouldExist) {
    Error.NotFound(res, { reason: 'User could not be found' });
  }

  return false;
}

export async function userOwnsTransaction(req: Request, res: Response, id: string) {
  const user = await Models.User.findById(req.user!._id);
  if (!user) {
    Error.NotFound(res, { reason: 'User could not be found' });
    return false;
  }

  if (!user.transactions.some(transaction => transaction === id)) {
    Error.Unauthorized(res);
    return false;
  }

  return true;
}

export async function userOwnsTransactions(req: Request, res: Response, transactions: string[]) {
  const user = await Models.User.findById(req.user!._id);
  if (!user) {
    Error.NotFound(res, { reason: 'User could not be found' });
    return false;
  }

  if (transactions.some(id => !user.transactions.some(txa => txa === id))) {
    Error.Unauthorized(res);
    return false;
  }

  return true;
}
