import store, { Transaction, State } from '../../store';

describe('Transaction store', () => {
  beforeAll(() => {
    store.dispatch(Transaction.actions.set([]));
  });

  afterAll(() => {
    store.dispatch(Transaction.actions.set([]));
  });

  it('Can set transactions', () => {
    expect(State.current.transactions).toEqual([]);

    store.dispatch(Transaction.actions.set([{ id: 'id', name: 'name', amount: 0, type: [] }]));

    expect(State.current.transactions).toEqual([{ id: 'id', name: 'name', amount: 0, type: [] }]);
  });

  it('Can add a transaction', () => {
    store.dispatch(Transaction.actions.add({ id: 'id-2', name: 'name', amount: 0, type: [] }));

    expect(State.current.transactions).toEqual([
      { id: 'id', name: 'name', amount: 0, type: [] },
      { id: 'id-2', name: 'name', amount: 0, type: [] }
    ]);
  });

  it('Can remove a transaction', () => {
    store.dispatch(Transaction.actions.remove('id-2'));

    expect(State.current.transactions).toEqual([{ id: 'id', name: 'name', amount: 0, type: [] }]);
  });

  it("Can call remove even if the transaction doesn't exist", () => {
    store.dispatch(Transaction.actions.remove('id-2'));

    expect(State.current.transactions).toEqual([{ id: 'id', name: 'name', amount: 0, type: [] }]);
  });

  it('Can clear transactions', () => {
    store.dispatch(Transaction.actions.clear());

    expect(State.current.transactions).toEqual([]);
  });
});
