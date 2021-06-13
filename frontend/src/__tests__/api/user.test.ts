import axios from 'axios';
import * as API from '../../api';
import store, { State, Transaction, User } from '../../store';
import { Mock } from '../utils';

describe('User api', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });
  beforeEach(() => {
    store.dispatch(Transaction.actions.clear());
    store.dispatch(User.actions.clear());
  });

  it('.register: POST /user/register -> 201', async () => {
    Mock.API.Success.CreatedResource('post', [{ id: '1' }]);

    const response = await API.User.register('username', 'password');

    expect(response).toEqual({ status: 201, data: { id: '1' } });
  });

  it('.register: POST /user/register -> 401', async () => {
    Mock.API.Error.Unauthorized('post');

    const response = await API.User.register('username', 'password');

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('.login: POST /user/login -> 200', async () => {
    Mock.API.Success.OK('post', [
      { id: '1', username: 'username', transactions: ['1'] },
      { transactions: [{ id: '1', name: 'name', amount: 1, type: [] }] }
    ]);

    const response = await API.User.login('username', 'password');

    expect(response).toEqual({
      status: 200,
      data: { id: '1', username: 'username', transactions: ['1'] }
    });
    expect(State.current.user).toEqual({ id: '1', username: 'username', transactions: ['1'] });
    expect(State.current.transactions).toEqual([{ id: '1', name: 'name', amount: 1, type: [] }]);
  });

  it('.login: POST /user/login -> 200 AND POST /transaction/find -> 500', async () => {
    jest
      .spyOn(axios, 'post')
      .mockResolvedValueOnce({
        status: 200,
        data: { id: '1', username: 'username', transactions: ['1'] }
      })
      .mockRejectedValue({ response: { status: 500, data: { reason: 'Internal server error' } } });

    const response = await API.User.login('username', 'password');

    expect(response).toEqual({
      status: 200,
      data: { id: '1', username: 'username', transactions: ['1'] }
    });
    expect(State.current.user).toEqual({ id: '1', username: 'username', transactions: ['1'] });
    expect(State.current.transactions).toEqual([]);
  });

  it('.login: POST /user/login -> 401', async () => {
    Mock.API.Error.Unauthorized('post');

    const response = await API.User.login('username', 'password');

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
    expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
    expect(State.current.transactions).toEqual([]);
  });

  it('.setTransactions: POST /user/update -> 200', async () => {
    Mock.API.Success.OK('post');

    const response = await API.User.setTransactions([]);

    expect(response).toEqual({ status: 200 });
  });

  it('.setTransactions: POST /user/update -> 401', async () => {
    Mock.API.Error.Unauthorized('post');

    const response = await API.User.setTransactions([]);

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('.logout: GET /user/logout -> 200', async () => {
    Mock.API.Success.OK('get');
    store.dispatch(User.actions.setId('id'));
    store.dispatch(User.actions.setUsername('user'));
    store.dispatch(User.actions.setTransactions(['id']));
    store.dispatch(Transaction.actions.set([{ id: 'id' }]));

    const response = await API.User.logout();

    expect(response).toEqual({ status: 200 });
    expect(State.current.transactions).toEqual([]);
    expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
  });

  it('.logout: GET /user/logout -> 404', async () => {
    Mock.API.Error.NotFound('get');
    store.dispatch(User.actions.setId('id'));
    store.dispatch(User.actions.setUsername('user'));
    store.dispatch(User.actions.setTransactions(['id']));
    store.dispatch(Transaction.actions.set([{ id: 'id' }]));

    const response = await API.User.logout();

    expect(response).toEqual({ status: 404, data: { reason: 'Resource could not be found' } });
    expect(State.current.transactions).toEqual([{ id: 'id' }]);
    expect(State.current.user).toEqual({ id: 'id', username: 'user', transactions: ['id'] });
  });

  it('.session: GET /user/session -> 200', async () => {
    Mock.API.Success.OK('get', [{ id: 'id', username: 'user', transactions: ['id'] }]);
    Mock.API.Success.OK('post', [
      { transactions: [{ id: 'id', name: 'name', amount: 1, type: [] }] }
    ]);

    const response = await API.User.session();

    expect(response).toEqual({
      status: 200,
      data: { id: 'id', username: 'user', transactions: ['id'] }
    });
    expect(State.current.transactions).toEqual([{ id: 'id', name: 'name', amount: 1, type: [] }]);
    expect(State.current.user).toEqual({ id: 'id', username: 'user', transactions: ['id'] });
  });

  it('.session: GET /user/session -> 200 AND POST /transaction/find -> 500', async () => {
    Mock.API.Success.OK('get', [{ id: 'id', username: 'user', transactions: ['id'] }]);

    const response = await API.User.session();

    expect(response).toEqual({
      status: 200,
      data: { id: 'id', username: 'user', transactions: ['id'] }
    });
    expect(State.current.transactions).toEqual([]);
    expect(State.current.user).toEqual({ id: 'id', username: 'user', transactions: ['id'] });
  });

  it('.session: GET /user/session -> 401', async () => {
    Mock.API.Error.Unauthorized('get');

    const response = await API.User.session();

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
    expect(State.current.transactions).toEqual([]);
    expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
  });
});
