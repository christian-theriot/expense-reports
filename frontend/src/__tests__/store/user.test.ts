import store, { State, Transaction, User } from '../../store';

describe('User store', () => {
  beforeAll(() => jest.restoreAllMocks());
  beforeEach(() => store.dispatch(Transaction.actions.clear()));

  it('Has a setId action', () => {
    store.dispatch(User.actions.setId('id'));

    expect(State.current.user.id).toBe('id');
  });

  it('Has a setUsername action', () => {
    store.dispatch(User.actions.setUsername('user'));

    expect(State.current.user.username).toBe('user');
  });

  it('Has a setTransactions action', () => {
    store.dispatch(User.actions.setTransactions(['2']));

    expect(State.current.user.transactions).toEqual(['2']);
  });

  it('Has an addTransaction action', () => {
    store.dispatch(User.actions.clear());
    store.dispatch(User.actions.addTransaction('1'));

    expect(State.current.user.transactions).toEqual(['1']);
  });

  it('Has a removeTransaction action', () => {
    store.dispatch(User.actions.setTransactions(['1']));
    store.dispatch(User.actions.removeTransaction('1'));

    expect(State.current.user.transactions).toEqual([]);
  });

  it('RemoveTransaction does nothing if the transaction does not exist', () => {
    const initialStore = State.current.user;

    store.dispatch(User.actions.removeTransaction('1'));

    expect(initialStore).toEqual(State.current.user);
  });

  it('Has a clearTransaction action', () => {
    store.dispatch(User.actions.setTransactions(['']));
    store.dispatch(User.actions.clearTransactions());

    expect(State.current.user.transactions.length).toBe(0);
  });

  it('Has a clear action', () => {
    store.dispatch(User.actions.setId('1'));
    store.dispatch(User.actions.setUsername('user'));
    store.dispatch(User.actions.setTransactions(['']));

    store.dispatch(User.actions.clear());

    expect(State.current.user).toEqual({
      id: '',
      username: '',
      transactions: []
    });
  });
});
