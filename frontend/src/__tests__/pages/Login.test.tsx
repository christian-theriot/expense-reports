import { Mock, renderComponent, waitFor } from '../utils';
import { Login } from '../../pages';
import store, { State, Transaction, User } from '../../store';
import userEvent from '@testing-library/user-event';

const renderLogin = () => {
  const output: { location?: any } = { location: undefined };
  const login = renderComponent(<Login />, '/login', output);
  const username = login.getByLabelText('username') as HTMLInputElement;
  const password = login.getByLabelText('password') as HTMLInputElement;
  const signIn = login.getByLabelText('sign in') as HTMLButtonElement;

  return { login, username, password, signIn, output };
};

describe('Login page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    Mock.API.Error.Unauthorized('get');
    Mock.API.Error.Unauthorized('post');
    store.dispatch(User.actions.clear());
    store.dispatch(Transaction.actions.clear());
  });

  it("Renders input fields labeled 'username', 'password', and 'sign in'", () => {
    const { username, password, signIn } = renderLogin();
    [username, password, signIn].forEach(element => expect(element).toBeInTheDocument());
  });

  it('Accepts user input', () => {
    const { username } = renderLogin();

    userEvent.type(username, 'user');

    expect(username.value).toBe('user');
  });

  it('Clicking sign up with valid inputs redirects to /', async () => {
    Mock.API.Success.OK('post', [
      { id: 'id', username: 'user', transactions: ['id'] },
      { transactions: [{ id: 'id', name: 'name' }] }
    ]);
    const { signIn, output } = renderLogin();

    userEvent.click(signIn);

    await waitFor(() => {
      expect(output.location.pathname).toBe('/');
      expect(State.current.transactions).toEqual([{ id: 'id', name: 'name' }]);
      expect(State.current.user).toEqual({ id: 'id', username: 'user', transactions: ['id'] });
    });
  });

  it('Redirects to / if a user is already logged in', async () => {
    Mock.API.Success.OK('get', [{ id: 'id', username: 'user', transactions: ['id'] }]);
    Mock.API.Success.OK('post', [{ transactions: [{ id: 'id', name: 'name' }] }]);
    const { output } = renderLogin();

    await waitFor(() => {
      expect(output.location.pathname).toBe('/');
      expect(State.current.transactions).toEqual([{ id: 'id', name: 'name' }]);
      expect(State.current.user).toEqual({ id: 'id', username: 'user', transactions: ['id'] });
    });
  });

  it('Does not redirect to / if the inputs are invalid', async () => {
    const { signIn, output } = renderLogin();

    userEvent.click(signIn);

    await waitFor(() => {
      expect(output.location.pathname).toBe('/login');
      expect(State.current.transactions).toEqual([]);
      expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
    });
  });
});
