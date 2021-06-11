import userEvent from '@testing-library/user-event';
import { Register } from '../../pages';
import axios from 'axios';
import { renderComponent, waitFor } from '../utils';

const renderRegister = (path: string = '/register', test?: { history?: any; location?: any }) => {
  const { component } = renderComponent(<Register />, path, test);

  const username = component.getByLabelText('username') as HTMLInputElement;
  const password = component.getByLabelText('password') as HTMLInputElement;
  const confirmPassword = component.getByLabelText('confirm password') as HTMLInputElement;
  const signUp = component.getByLabelText('sign up') as HTMLButtonElement;

  return { register: component, username, password, confirmPassword, signUp };
};

describe('Register page', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(axios, 'get').mockRejectedValue({
      response: { status: 401, data: { reason: 'User is unauthorized to perform this action' } }
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it('Renders by default', () => {
    const { register } = renderRegister();

    expect(register).toBeDefined();
  });

  it('Renders with username field', () => {
    const { username } = renderRegister();

    expect(username).toBeDefined();
  });

  it('Renders with password field', () => {
    const { password } = renderRegister();

    expect(password).toBeDefined();
  });

  it('Renders with confirmPassword field', () => {
    const { confirmPassword } = renderRegister();

    expect(confirmPassword).toBeDefined();
  });

  it('Renders with submit button', () => {
    const { signUp } = renderRegister();

    expect(signUp).toBeDefined();
  });

  it('Can accept a value for username', () => {
    const { username } = renderRegister();

    userEvent.type(username, 'username');

    expect(username.value).toBe('username');
  });

  it('Can click the submit button', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      response: { status: 500, data: { reason: 'Internal server error' } }
    });

    let test: { location?: any } = { location: undefined };
    const { signUp } = renderRegister('/register', test);

    userEvent.click(signUp);

    await waitFor(() => expect(test.location.pathname).toBe('/register'));
  });

  it('Can click the submit button with valid values', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ status: 201, data: { id: 'id' } });

    let test: { location?: any } = { location: undefined };
    const { username, password, confirmPassword, signUp } = renderRegister('/register', test);

    userEvent.type(username, 'username');
    userEvent.type(password, 'password');
    userEvent.type(confirmPassword, 'password');
    userEvent.click(signUp);

    await waitFor(() => expect(test.location.pathname).toBe('/login'));
  });

  it('Redirects to / if a user session already exists', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: { id: 'id', username: 'user', transactions: [] }
    });

    let test: { location?: any } = { location: undefined };
    renderRegister('/register', test);

    await waitFor(() => expect(test.location.pathname).toBe('/'));
  });

  it('Does not redirect if a user session does not already exist', async () => {
    let test: { location?: any } = { location: undefined };
    renderRegister('/register', test);

    await waitFor(() => expect(test.location.pathname).toBe('/register'));
  });
});
