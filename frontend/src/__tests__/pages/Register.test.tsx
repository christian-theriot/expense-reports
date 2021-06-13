import { Mock, renderComponent, waitFor } from '../utils';
import { Register } from '../../pages';
import store, { State, Transaction, User } from '../../store';
import userEvent from '@testing-library/user-event';

const renderRegister = () => {
  const output: { location?: any } = { location: undefined };
  const register = renderComponent(<Register />, '/register', output);
  const username = register.getByLabelText('username') as HTMLInputElement;
  const password = register.getByLabelText('password') as HTMLInputElement;
  const confirmPassword = register.getByLabelText('confirm password') as HTMLInputElement;
  const signUp = register.getByLabelText('sign up') as HTMLButtonElement;

  return { register, username, password, confirmPassword, signUp, output };
};

describe('Register page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    Mock.API.Error.Unauthorized('get');
    Mock.API.Error.Unauthorized('post');
    store.dispatch(User.actions.clear());
    store.dispatch(Transaction.actions.clear());
  });

  it("Renders input fields labeled 'username', 'password', 'confirm password', and 'sign up'", () => {
    const { username, password, confirmPassword, signUp } = renderRegister();

    [username, password, confirmPassword, signUp].forEach(element =>
      expect(element).toBeInTheDocument()
    );
  });

  it('Accepts user input', () => {
    const { username } = renderRegister();

    userEvent.type(username, 'user');

    expect(username.value).toBe('user');
  });

  it('Clicking sign up with valid inputs redirects to /login', async () => {
    Mock.API.Success.CreatedResource('post', [{ id: 'id' }]);
    const { signUp, output } = renderRegister();

    userEvent.click(signUp);

    await waitFor(() => expect(output.location.pathname).toBe('/login'));
  });

  it('Redirects to / if a user is already logged in', async () => {
    Mock.API.Success.OK('get', [{ id: 'id', username: 'user', transactions: ['id'] }]);
    Mock.API.Success.OK('post', [{ transactions: [{ id: 'id', name: 'name' }] }]);
    const { output } = renderRegister();

    await waitFor(() => {
      expect(output.location.pathname).toBe('/');
      expect(State.current.transactions).toEqual([{ id: 'id', name: 'name' }]);
      expect(State.current.user).toEqual({ id: 'id', username: 'user', transactions: ['id'] });
    });
  });

  it('Does not redirect to /login if the inputs are invalid', async () => {
    const { signUp, output } = renderRegister();

    userEvent.click(signUp);

    await waitFor(() => {
      expect(output.location.pathname).toBe('/register');
      expect(State.current.transactions).toEqual([]);
      expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
    });
  });
});
