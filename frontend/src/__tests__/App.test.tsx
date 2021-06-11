import { renderComponent } from './utils';
import App from '../App';
import axios from 'axios';

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 401, data: {} });
  });
  afterEach(() => jest.restoreAllMocks());

  it('Renders nothing at /', () => {
    const { component } = renderComponent(<App />);
    const [signIn, signUp] = [
      component.queryByLabelText('sign in'),
      component.queryByLabelText('sign up')
    ];

    expect(signIn).not.toBeInTheDocument();
    expect(signUp).not.toBeInTheDocument();
  });

  it('Renders the login page at /login', () => {
    const { component } = renderComponent(<App />, '/login');
    const signIn = component.getByLabelText('sign in');

    expect(signIn).toBeDefined();
  });

  it('Renders the register page at /register', () => {
    const { component } = renderComponent(<App />, '/register');
    const signUp = component.getByLabelText('sign up');

    expect(signUp).toBeDefined();
  });
});
