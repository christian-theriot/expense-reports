import axios from 'axios';
import store, { Transaction, User as UserStore } from '../store';
import * as API from './transaction';

export namespace User {
  export async function register(username: string, password: string) {
    try {
      const response = await axios.post(
        '/user/register',
        { username, password },
        { withCredentials: true }
      );

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log(err.response);
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function login(username: string, password: string) {
    try {
      const response = await axios.post(
        '/user/login',
        { username, password },
        { withCredentials: true }
      );

      store.dispatch(UserStore.actions.setId(response.data.id));
      store.dispatch(UserStore.actions.setUsername(response.data.username));
      store.dispatch(UserStore.actions.setTransactions(response.data.transactions));

      try {
        const transactions = await API.Transaction.findMany(response.data.transactions);

        store.dispatch(Transaction.actions.set(transactions.data.transactions));
      } catch (err) {
        console.log({ err });
      }

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function setTransactions(transactions: string[]) {
    try {
      const response = await axios.post(
        '/user/update',
        { transactions },
        { withCredentials: true }
      );

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function logout() {
    try {
      const response = await axios.get('/user/logout', { withCredentials: true });

      store.dispatch(UserStore.actions.clear());
      store.dispatch(Transaction.actions.clear());

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function session() {
    try {
      const response = await axios.get('/user/session', { withCredentials: true });

      store.dispatch(UserStore.actions.setId(response.data.id));
      store.dispatch(UserStore.actions.setUsername(response.data.username));
      store.dispatch(UserStore.actions.setTransactions(response.data.transactions));

      try {
        const transactions = await API.Transaction.findMany(response.data.transactions);

        store.dispatch(Transaction.actions.set(transactions.data.transactions));
      } catch (err) {
        console.log({ err });
      }

      return { status: response.status, data: response.data };
    } catch (err) {
      console.log({ err });
      return { status: err.response.status, data: err.response.data };
    }
  }
}
