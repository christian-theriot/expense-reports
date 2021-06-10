import { User } from '../../api';
import axios from 'axios';

describe('User API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /user/register -> 201', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 201,
      data: { id: 'id' }
    });

    const response = await User.register('username', 'password');

    expect(response).toEqual({ status: 201, data: { id: 'id' } });
  });

  it('POST /user/register -> 401', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 401, data: { reason: 'User is unauthorized to perform this action' } }
    });

    const response = await User.register('username', 'password');

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('POST /user/login -> 200', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 200,
      data: { id: 'id' }
    });

    const response = await User.login('username', 'password');

    expect(response).toEqual({ status: 200, data: { id: 'id' } });
  });

  it('POST /user/login -> 401', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 401, data: { reason: 'User is unauthorized to perform this action' } }
    });

    const response = await User.login('username', 'password');

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('POST /user/update -> 200', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 200,
      data: { reason: 'Set transactions for user' }
    });

    const response = await User.setTransactions([]);

    expect(response).toEqual({ status: 200, data: { reason: 'Set transactions for user' } });
  });

  it('POST /user/update -> 401', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce({
      response: { status: 401, data: { reason: 'User is unauthorized to perform this action' } }
    });

    const response = await User.setTransactions([]);

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });

  it('GET /user/logout -> 200', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      status: 200,
      data: { reason: 'User has logged out' }
    });

    const response = await User.logout();

    expect(response).toEqual({ status: 200, data: { reason: 'User has logged out' } });
  });

  it('GET /user/logout -> 401', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({
      response: { status: 401, data: { reason: 'User is unauthorized to perform this action' } }
    });

    const response = await User.logout();

    expect(response).toEqual({
      status: 401,
      data: { reason: 'User is unauthorized to perform this action' }
    });
  });
});
