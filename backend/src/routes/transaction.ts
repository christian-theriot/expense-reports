import * as Controllers from '../controllers';
import { Router } from 'express';

export function Transaction() {
  const transaction = Router();

  transaction.post('/create', Controllers.Transaction.create);
  transaction.post('/update/:id', Controllers.Transaction.update);
  transaction.get('/:id', Controllers.Transaction.findOne);
  transaction.post('/find', Controllers.Transaction.findMany);

  return transaction;
}
