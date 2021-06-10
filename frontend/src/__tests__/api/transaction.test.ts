import { Transaction } from '../../api';
import axios from 'axios';

describe('Transaction API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /transaction/create -> 201', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 201,
      data: { id: 'id' }
    });

    const response = await Transaction.create({ name: 'name', amount: 0, type: [] });

    expect(response).toEqual({ status: 201, data: { id: 'id' } });
  });

  it('POST /transaction/create -> 500', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    const response = await Transaction.create({ name: 'name', amount: 0, type: [] });

    expect(response).toEqual({ status: 500, data: { reason: 'Internal server error' } });
  });

  it('POST /transaction/update -> 200', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 200,
      data: { reason: 'Transaction has been updated' }
    });

    const response = await Transaction.update({ id: 'id', name: 'name', amount: 0, type: [] });

    expect(response).toEqual({ status: 200, data: { reason: 'Transaction has been updated' } });
  });

  it('POST /transaction/update -> 500', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    const response = await Transaction.update({ id: 'id', name: 'name', amount: 0, type: [] });

    expect(response).toEqual({ status: 500, data: { reason: 'Internal server error' } });
  });

  it('GET /transaction/id -> 200', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      status: 200,
      data: { name: 'name', amount: 0, type: [] }
    });

    const response = await Transaction.findOne('id');

    expect(response).toEqual({ status: 200, data: { name: 'name', amount: 0, type: [] } });
  });

  it('GET /transaction/id -> 500', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    const response = await Transaction.findOne('id');

    expect(response).toEqual({ status: 500, data: { reason: 'Internal server error' } });
  });

  it('POST /transaction/update/id -> 200', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 200,
      data: { transactions: [{ name: 'name', amount: 0, type: [] }] }
    });

    const response = await Transaction.findMany(['id']);

    expect(response).toEqual({
      status: 200,
      data: { transactions: [{ name: 'name', amount: 0, type: [] }] }
    });
  });

  it('POST /transaction/update/id -> 500', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    const response = await Transaction.findMany(['id']);

    expect(response).toEqual({ status: 500, data: { reason: 'Internal server error' } });
  });

  it('DELETE /transaction/id -> 200', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValueOnce({
      status: 200,
      data: { reason: 'Transaction has been deleted' }
    });

    const response = await Transaction.deleteOne('id');

    expect(response).toEqual({ status: 200, data: { reason: 'Transaction has been deleted' } });
  });

  it('DELETE /transaction/id -> 500', async () => {
    jest.spyOn(axios, 'delete').mockRejectedValueOnce({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    const response = await Transaction.deleteOne('id');

    expect(response).toEqual({ status: 500, data: { reason: 'Internal server error' } });
  });
});
