import * as Controllers from '../controllers';
import { Router } from 'express';

export const Transaction = () => {
  const txa = Router();

  txa.post('/create', Controllers.Transaction.create);
  txa.post('/update', Controllers.Transaction.update);
  txa.get('/:id', Controllers.Transaction.find);
  txa.delete('/:id', Controllers.Transaction.delete);

  return txa;
};
