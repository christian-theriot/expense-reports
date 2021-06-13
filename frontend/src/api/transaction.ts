import store, { TransactionType, User, Transaction as TransactionStore } from '../store';
import axios from 'axios';

export namespace Transaction {
  export async function create({
    name,
    amount,
    type,
    date
  }: {
    name: string;
    amount: number;
    type: TransactionType[];
    date?: string;
  }) {
    try {
      const response = await axios.post(
        '/transaction/create',
        { name, amount, type, date },
        { withCredentials: true }
      );

      store.dispatch(User.actions.addTransaction(response.data.id));
      store.dispatch(
        TransactionStore.actions.add({ id: response.data.id, name, amount, type, date })
      );

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log({ err });
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function update({
    id,
    name,
    amount,
    type,
    date
  }: {
    id: string;
    name?: string;
    amount?: number;
    type?: TransactionType[];
    date?: string;
  }) {
    try {
      const response = await axios.post(
        `/transaction/update/${id}`,
        { name, amount, date, type },
        { withCredentials: true }
      );

      store.dispatch(
        TransactionStore.actions.update({
          id,
          name,
          amount,
          type,
          date
        })
      );

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log({ err });
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function findOne(id: string) {
    try {
      const response = await axios.get(`/transaction/${id}`, { withCredentials: true });

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log({ err });
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function findMany(ids: string[]) {
    try {
      const response = await axios.post('/transaction/find', { ids }, { withCredentials: true });

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log({ err });
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function deleteOne(id: string) {
    try {
      const response = await axios.delete(`/transaction/${id}`, { withCredentials: true });

      store.dispatch(TransactionStore.actions.remove(id));

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log({ err });
      return { status: err.response.status, data: err.response.data };
    }
  }
}
