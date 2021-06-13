import * as API from '../../api';
import store, { State, Transaction, User } from '../../store';
import { Mock } from '../utils/mock';

describe('Transaction api', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });
  beforeEach(() => {
    store.dispatch(Transaction.actions.clear());
    store.dispatch(User.actions.clear());
  });

  it('.create: POST /transaction/create -> 201', async () => {
    Mock.API.Success.CreatedResource('post', [{ id: '1' }]);

    const response = await API.Transaction.create({ name: 'name', amount: 1, type: [] });

    expect(response).toEqual({ status: 201, data: { id: '1' } });
    expect(State.current.transactions).toEqual([{ id: '1', name: 'name', amount: 1, type: [] }]);
    expect(State.current.user.transactions).toEqual(['1']);
  });

  it('.create: POST /transaction/create -> 401', async () => {
    Mock.API.Error.Unauthorized('post');

    const response = await API.Transaction.create({ name: 'name', amount: 1, type: [] });

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('.update: POST /transaction/update/<id> -> 200', async () => {
    Mock.API.Success.OK('post');
    store.dispatch(Transaction.actions.set([{ id: '1' }]));

    const response = await API.Transaction.update({ id: '1', name: 'name' });

    expect(response).toEqual({ status: 200 });
    expect(State.current.transactions).toEqual([{ id: '1', name: 'name' }]);
  });

  it('.update: POST /transaction/update/<id> -> 401', async () => {
    Mock.API.Error.Unauthorized('post');

    const response = await API.Transaction.update({ id: '1', name: 'name' });

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
    expect(State.current.transactions).toEqual([]);
  });

  it('.findOne: GET /transaction/<id> -> 200', async () => {
    Mock.API.Success.OK('get', [{ name: 'name', amount: 1, type: [] }]);

    const response = await API.Transaction.findOne('1');

    expect(response).toEqual({ status: 200, data: { name: 'name', amount: 1, type: [] } });
  });

  it('.findOne: GET /transaction/<id> -> 404', async () => {
    Mock.API.Error.NotFound('get');

    const response = await API.Transaction.findOne('1');

    expect(response).toEqual({ status: 404, data: { reason: 'Resource could not be found' } });
  });

  it('.findMany: POST /transaction/find -> 200', async () => {
    Mock.API.Success.OK('post', [
      {
        transactions: [{ id: '1', name: 'name', amount: 1, type: [] }]
      }
    ]);

    const response = await API.Transaction.findMany(['1']);

    expect(response).toEqual({
      status: 200,
      data: { transactions: [{ id: '1', name: 'name', amount: 1, type: [] }] }
    });
  });

  it('.findMany: POST /transaction/find -> 401', async () => {
    Mock.API.Error.Unauthorized('post');

    const response = await API.Transaction.findMany(['1']);

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('.deleteOne: DELETE /transaction/<id> -> 200', async () => {
    Mock.API.Success.OK('delete');
    store.dispatch(Transaction.actions.set([{ id: '1', name: 'name' }]));

    const response = await API.Transaction.deleteOne('1');

    expect(response).toEqual({ status: 200 });
    expect(State.current.transactions).toEqual([]);
  });

  it('.deleteOne: DELETE /transaction/<id> -> 401', async () => {
    Mock.API.Error.Unauthorized('delete');
    store.dispatch(Transaction.actions.set([{ id: '1', name: 'name' }]));

    const response = await API.Transaction.deleteOne('1');

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
    expect(State.current.transactions).toEqual([{ id: '1', name: 'name' }]);
  });
});
