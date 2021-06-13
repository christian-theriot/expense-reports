import { Mock, renderComponent, waitFor } from '../utils';
import { Logout } from '../../pages';
import store, { State, Transaction, User } from '../../store';

describe('Logout component', () => {
  it('Calls API.User.logout', async () => {
    Mock.API.Success.OK('get');
    store.dispatch(User.actions.setId('id'));
    store.dispatch(User.actions.setUsername('user'));
    store.dispatch(User.actions.setTransactions(['id']));
    store.dispatch(Transaction.actions.set([{ id: 'id' }]));

    renderComponent(<Logout />);

    await waitFor(() => {
      expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
      expect(State.current.transactions).toEqual([]);
    });
  });

  it('Redirects to /', async () => {
    Mock.API.Success.OK('get');
    const test: { location?: any } = { location: undefined };
    renderComponent(<Logout />, '/logout', test);

    await waitFor(() => expect(test.location.pathname).toBe('/'));
  });
});
