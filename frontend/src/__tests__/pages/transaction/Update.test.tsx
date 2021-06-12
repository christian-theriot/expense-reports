import userEvent from '@testing-library/user-event';
import { Update } from '../../../pages/transaction';
import store, { Transaction } from '../../../store';
import { renderComponent, waitFor } from '../../utils';
import axios from 'axios';

const renderUpdateView = (id: string) => {
  const hidden: { value: boolean } = { value: false };
  let onHide = () => {
    hidden.value = true;
  };

  const { component } = renderComponent(
    <table>
      <tbody>
        <Update id={id} hide={onHide} />
      </tbody>
    </table>
  );

  const date = component.queryByLabelText('date') as HTMLInputElement;
  const name = component.queryByLabelText('name') as HTMLInputElement;
  const amount = component.queryByLabelText('amount') as HTMLInputElement;
  const type = component.queryByLabelText('type') as HTMLSelectElement;
  const update = component.queryByLabelText('update transaction') as HTMLButtonElement;
  const cancel = component.queryByLabelText('cancel update') as HTMLButtonElement;

  return {
    view: component,
    transaction: {
      date,
      name,
      amount,
      type
    },
    update,
    cancel,
    hidden
  };
};

describe('Update Transaction page', () => {
  beforeEach(() => {
    jest
      .spyOn(axios, 'post')
      .mockRejectedValue({ response: { status: 500, data: { reason: 'Internal server error' } } });
    store.dispatch(Transaction.actions.set([{ id: '1', name: 'name', amount: 1 }]));
  });
  afterEach(() => jest.restoreAllMocks());

  it("Renders nothing if the id doesn't exist in the store", () => {
    store.dispatch(Transaction.actions.clear());

    const { transaction } = renderUpdateView('invalid');

    expect(transaction.date).not.toBeInTheDocument();
  });

  it('Renders with a date field', () => {
    store.dispatch(Transaction.actions.update({ id: '1', date: '2021-06-01' }));
    const { transaction } = renderUpdateView('1');

    expect(transaction.date).toBeInTheDocument();
  });

  it('Renders with a name field', () => {
    const { transaction } = renderUpdateView('1');

    expect(transaction.name).toBeInTheDocument();
  });

  it('Renders with a amount field', () => {
    const { transaction } = renderUpdateView('1');

    expect(transaction.amount).toBeInTheDocument();
  });

  it('Renders with a type field', () => {
    const { transaction } = renderUpdateView('1');

    expect(transaction.type).toBeInTheDocument();
  });

  it('Can accept a value for date', () => {
    const { transaction } = renderUpdateView('1');

    userEvent.type(transaction.date, '2021-06-01');

    expect(transaction.date.value).toBe('2021-06-01');
  });

  it('Can accept multiple values for type', () => {
    const { transaction } = renderUpdateView('1');

    userEvent.selectOptions(transaction.type, ['Rent', 'Subscription']);

    expect(Array.from(transaction.type.selectedOptions, option => option.value)).toEqual([
      'Rent',
      'Subscription'
    ]);
  });

  it('Can click the update transaction button', async () => {
    store.dispatch(Transaction.actions.set([{ id: '1', name: 'name' }]));

    const initialStore = store.getState();
    const { transaction, update } = renderUpdateView('1');

    userEvent.type(transaction.date, '2021-06-01');
    userEvent.click(update);

    await waitFor(() => expect(store.getState()).toEqual(initialStore));
  });

  it('Can click the update transaction button with valid values', async () => {
    jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ status: 200, data: { reason: 'Transaction has been updated' } });

    const initialStore = store.getState();
    const { transaction, update } = renderUpdateView('1');

    userEvent.type(transaction.name, 'name');
    userEvent.type(transaction.amount, '1');
    userEvent.click(update);

    await waitFor(() => expect(store.getState()).not.toEqual(initialStore));
  });

  it('Can click the update transaction button with valid values but fail the API call', async () => {
    const initialStore = store.getState();
    const { transaction, update } = renderUpdateView('1');

    userEvent.type(transaction.name, 'name');
    userEvent.type(transaction.amount, '1');
    userEvent.click(update);

    await waitFor(() => expect(store.getState()).toEqual(initialStore));
  });

  it('Can click the cancel button, which calls the hide prop', async () => {
    const { hidden, cancel } = renderUpdateView('1');

    userEvent.click(cancel);

    await waitFor(() => expect(hidden.value).toBeTruthy());
  });
});
