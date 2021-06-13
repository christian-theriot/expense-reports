import { Mock, renderComponent, waitFor } from './utils';
import App from '../App';
import userEvent from '@testing-library/user-event';

const renderApp = (path: string = '/') => {
  const output: { location?: any } = { location: undefined };
  const app = renderComponent(<App />, path, output);

  const navbar = {
    brand: app.getByTestId('brand'),
    home: app.getByTestId('home'),
    sign: {
      in: app.getByTestId('login'),
      up: app.getByTestId('register'),
      out: app.getByTestId('logout')
    }
  };
  const home = app.queryByLabelText('create new transaction');
  const login = app.queryByLabelText('sign in');
  const register = app.queryByLabelText('sign up');

  return { app, navbar, home, login, register, output };
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

  it('Clicking brand redirects to /', async () => {
    const { navbar, output } = renderApp('/redirecting');

    userEvent.click(navbar.brand);

    await waitFor(() => expect(output.location.pathname).toBe('/'));
  });

  it('Clicking home redirects to /', async () => {
    const { navbar, output } = renderApp('/redirecting');

    userEvent.click(navbar.home);

    await waitFor(() => expect(output.location.pathname).toBe('/'));
  });

  it('Clicking Sign In redirects to /login', async () => {
    const { navbar, output } = renderApp();

    userEvent.click(navbar.sign.in);

    await waitFor(() => expect(output.location.pathname).toBe('/login'));
  });

  it('Clicking Sign Up redirects to /register', async () => {
    const { navbar, output } = renderApp();

    userEvent.click(navbar.sign.up);

    await waitFor(() => expect(output.location.pathname).toBe('/register'));
  });

  it('Clicking Sign Out redirects to /logout', async () => {
    const { navbar, output } = renderApp();

    userEvent.click(navbar.sign.out);

    await waitFor(() => expect(output.location.pathname).toBe('/logout'));
  });
});
