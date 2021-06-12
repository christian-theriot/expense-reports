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

  it('Can update name', () => {
    store.dispatch(Transaction.actions.set([{ id: 1, name: 'name', amount: 1 }]));
    store.dispatch(Transaction.actions.update({ id: 1, name: 'new name' }));

    expect(State.current.transactions).toEqual([{ id: 1, name: 'new name', amount: 1 }]);
  });

  it('Can update other values', () => {
    store.dispatch(Transaction.actions.set([{ id: 1, name: 'name' }]));
    store.dispatch(Transaction.actions.update({ id: 1, amount: 1, date: '2021-06-01', type: [] }));

    expect(State.current.transactions).toEqual([
      { id: 1, name: 'name', amount: 1, date: '2021-06-01', type: [] }
    ]);
  });

  it('Can fail to update any transaction', () => {
    store.dispatch(Transaction.actions.clear());
    store.dispatch(Transaction.actions.update({ id: 1 }));

    expect(State.current.transactions).toEqual([]);
  });
});
