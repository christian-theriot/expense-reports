import { TransactionType } from '../store';
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

      return { status: response.status, data: response.data };
    } catch (err) {
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

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function findOne(id: string) {
    try {
      const response = await axios.get(`/transaction/${id}`, { withCredentials: true });

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function findMany(ids: string[]) {
    try {
      const response = await axios.post('/transaction/find', { ids }, { withCredentials: true });

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function deleteOne(id: string) {
    try {
      const response = await axios.delete(`/transaction/${id}`, { withCredentials: true });

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }
}
