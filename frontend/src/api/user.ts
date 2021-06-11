import axios from 'axios';

export namespace User {
  export async function register(username: string, password: string) {
    try {
      const response = await axios.post(
        '/user/register',
        { username, password },
        { withCredentials: true }
      );

      console.log(response);
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

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }

  export async function session() {
    try {
      const response = await axios.get('/user/session', { withCredentials: true });

      return { status: response.status, data: response.data };
    } catch (err) {
      return { status: err.response.status, data: err.response.data };
    }
  }
}
