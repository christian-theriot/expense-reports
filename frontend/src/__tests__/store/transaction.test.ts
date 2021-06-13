import store, { State, Transaction } from '../../store';

describe('Transaction store', () => {
  beforeAll(() => jest.restoreAllMocks());
  beforeEach(() => store.dispatch(Transaction.actions.clear()));

  it('Has a set action', () => {
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.set([{}]));

    expect(initialStore).not.toEqual(State.current.transactions);
  });

  it('Has an add action', () => {
    store.dispatch(Transaction.actions.add({ id: '1', name: 'name', amount: 1, type: [] }));

    expect(State.current.transactions).toEqual([
      {
        id: '1',
        name: 'name',
        amount: 1,
        type: []
      }
    ]);
  });

  it('The add action can update existing values', () => {
    store.dispatch(Transaction.actions.set([{ id: '1' }]));
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.add({ id: '1', amount: 1 }));

    expect(initialStore.length).toBe(State.current.transactions.length);
    expect(State.current.transactions[0]).toEqual({ id: '1', amount: 1 });
  });

  it('The add action can update partial values', () => {
    store.dispatch(Transaction.actions.set([{ id: '1' }]));
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.add({ id: '1', name: 'name' }));

    expect(initialStore.length).toBe(State.current.transactions.length);
    expect(State.current.transactions[0]).toEqual({ id: '1', name: 'name' });
  });

  it('Has a remove action', () => {
    store.dispatch(Transaction.actions.set([{ id: '1' }]));
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.remove('1'));

    expect(initialStore.length - 1).toBe(State.current.transactions.length);
  });

  it('Remove does nothing given an invalid id', () => {
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.remove('1'));

    expect(initialStore).toEqual(State.current.transactions);
  });

  it('Has a clear action', () => {
    expect(State.current.transactions.length).toBe(0);
  });

  it('Has an update action', () => {
    store.dispatch(Transaction.actions.set([{ id: '1' }]));
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.update({ id: '1', name: 'name' }));

    expect(initialStore).not.toEqual(State.current.transactions);
  });

  it('Update can modify partial values', () => {
    store.dispatch(Transaction.actions.set([{ id: '1' }]));
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.update({ id: '1', amount: 1 }));

    expect(initialStore).not.toEqual(State.current.transactions);
  });

  it('Update does nothing given an invalid id', () => {
    const initialStore = State.current.transactions;

    store.dispatch(Transaction.actions.update({ id: '1', name: 'name' }));

    expect(initialStore).toEqual(State.current.transactions);
  });
});
