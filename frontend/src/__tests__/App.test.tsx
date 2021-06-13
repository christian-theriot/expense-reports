import { Mock, renderComponent, waitFor } from './utils';
import App from '../App';

const renderApp = (path: string = '/') => {
  const app = renderComponent(<App />, path);

  const home = app.queryByLabelText('create new transaction');
  const login = app.queryByLabelText('sign in');
  const register = app.queryByLabelText('sign up');

  return { app, home, login, register };
};

describe('App component', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    Mock.API.Error.Unauthorized('get');
  });

  it('Renders the home page at /', () => {
    const { home } = renderApp();

    expect(home).toBeInTheDocument();
  });

  it('Renders the login page at /login', () => {
    const { login } = renderApp('/login');

    expect(login).toBeInTheDocument();
  });

  it('Renders the register page at /register', () => {
    const { register } = renderApp('/register');

    expect(register).toBeInTheDocument();
  });
});
