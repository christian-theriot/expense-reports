import * as Controllers from '../controllers';
import { Router } from 'express';

export const Transaction = Router();

Transaction.post('/create', Controllers.Transaction.create);
Transaction.post('/update/:id', Controllers.Transaction.update);
Transaction.get('/:id', Controllers.Transaction.findOne);
Transaction.post('/find', Controllers.Transaction.findMany);
Transaction.delete('/:id', Controllers.Transaction.deleteOne);
