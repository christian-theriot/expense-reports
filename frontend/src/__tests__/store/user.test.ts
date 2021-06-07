import store, { User, State } from '../../store';

describe('User store', () => {
  beforeAll(() => {
    store.dispatch(User.actions.setId(''));
    store.dispatch(User.actions.setUsername(''));
    store.dispatch(User.actions.setTransactions([]));
  });

  afterAll(() => {
    store.dispatch(User.actions.setId(''));
    store.dispatch(User.actions.setUsername(''));
    store.dispatch(User.actions.setTransactions([]));
  });

  it('Can set id', () => {
    expect(State.current.user.id).toBe('');

    store.dispatch(User.actions.setId('id'));

    expect(State.current.user.id).toBe('id');
  });

  it('Can set username', () => {
    expect(State.current.user.username).toBe('');

    store.dispatch(User.actions.setUsername('username'));

    expect(State.current.user.username).toBe('username');
  });

  it('Can set transactions', () => {
    expect(State.current.user.transactions).toEqual([]);

    store.dispatch(User.actions.setTransactions(['id']));

    expect(State.current.user.transactions).toEqual(['id']);
  });

  it('Can add a transaction', () => {
    store.dispatch(User.actions.addTransaction('id-2'));

    expect(State.current.user.transactions).toEqual(['id', 'id-2']);
  });

  it('Can remove a transaction', () => {
    store.dispatch(User.actions.removeTransaction('id-2'));

    expect(State.current.user.transactions).toEqual(['id']);
  });

  it("Can call remove a transaction even if the transaction doesn't exist", () => {
    store.dispatch(User.actions.removeTransaction('id-2'));

    expect(State.current.user.transactions).toEqual(['id']);
  });

  it('Can call clear transactions', () => {
    store.dispatch(User.actions.clearTransactions());

    expect(State.current.user.transactions).toEqual([]);
  });

  it('Can clear the user', () => {
    expect(State.current.user).toEqual({ id: 'id', username: 'username', transactions: [] });

    store.dispatch(User.actions.clear());

    expect(State.current.user).toEqual({ id: '', username: '', transactions: [] });
  });
});
