import userEvent from '@testing-library/user-event';
import { Login } from '../../pages';
import axios from 'axios';
import { renderComponent, waitFor } from '../utils';

const renderLogin = (path: string = '/login', test?: { history?: any; location?: any }) => {
  const { component } = renderComponent(<Login />, path, test);

  const username = component.getByLabelText('username') as HTMLInputElement;
  const password = component.getByLabelText('password') as HTMLInputElement;
  const signIn = component.getByLabelText('sign in');

  return { login: component, username, password, signIn };
};

describe('Login page', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(axios, 'get').mockRejectedValue({
      response: { status: 401, data: { reason: 'User is unauthorized to perform this action' } }
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it('Renders by default', () => {
    const { login } = renderLogin();

    expect(login).toBeDefined();
  });

  it('Renders with username field', () => {
    const { username } = renderLogin();

    expect(username).toBeDefined();
  });

  it('Renders with password field', () => {
    const { password } = renderLogin();

    expect(password).toBeDefined();
  });

  it('Renders with submit button', () => {
    const { signIn } = renderLogin();

    expect(signIn).toBeDefined();
  });

  it('Can accept a value for username', () => {
    const { username } = renderLogin();

    userEvent.type(username, 'username');

    expect(username.value).toBe('username');
  });

  it('Can click the submit button', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    let test: { location?: any } = { location: undefined };
    const { signIn } = renderLogin('/login', test);

    userEvent.click(signIn);

    await waitFor(() => expect(test.location.pathname).toBe('/login'));
  });

  it('Can click the submit button with valid values', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 200, data: { id: 'id' } });

    let test: { location?: any } = { location: undefined };
    const { username, password, signIn } = renderLogin('/login', test);

    userEvent.type(username, 'username');
    userEvent.type(password, 'password');
    userEvent.click(signIn);

    await waitFor(() => expect(test.location.pathname).toBe('/'));
  });

  it('Redirects to / if a user session already exists', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: { id: 'id', username: 'user', transactions: [] }
    });

    let test: { location?: any } = { location: undefined };
    renderLogin('/login', test);

    await waitFor(() => expect(test.location.pathname).toBe('/'));
  });

  it('Does not redirect if a user session does not already exist', async () => {
    let test: { location?: any } = { location: undefined };
    renderLogin('/login', test);

    await waitFor(() => expect(test.location.pathname).toBe('/login'));
  });
});
