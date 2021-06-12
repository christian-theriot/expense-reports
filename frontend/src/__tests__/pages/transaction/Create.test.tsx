import userEvent from '@testing-library/user-event';
import { Create } from '../../../pages/transaction';
import store from '../../../store';
import { renderComponent, waitFor } from '../../utils';
import axios from 'axios';

const renderCreateView = () => {
  const hidden: { value: boolean } = { value: false };
  let onHide = () => {
    hidden.value = true;
  };

  const { component } = renderComponent(<Create hide={onHide} />);

  const date = component.getByLabelText('date') as HTMLSelectElement;
  const name = component.getByLabelText('name') as HTMLInputElement;
  const amount = component.getByLabelText('amount') as HTMLInputElement;
  const type = component.getByLabelText('type') as HTMLSelectElement;
  const create = component.getByLabelText('create transaction') as HTMLButtonElement;
  const cancel = component.getByLabelText('cancel create') as HTMLButtonElement;

  return {
    view: component,
    transaction: {
      date,
      name,
      amount,
      type
    },
    create,
    cancel,
    hidden
  };
};

describe('Create Transaction page', () => {
  beforeEach(() =>
    jest
      .spyOn(axios, 'post')
      .mockRejectedValue({ response: { status: 500, data: { reason: 'Internal server error' } } })
  );
  afterEach(() => jest.restoreAllMocks());

  it('Renders with a date field', () => {
    const { transaction } = renderCreateView();

    expect(transaction.date).toBeInTheDocument();
  });

  it('Renders with a name field', () => {
    const { transaction } = renderCreateView();

    expect(transaction.name).toBeInTheDocument();
  });

  it('Renders with an amount field', () => {
    const { transaction } = renderCreateView();

    expect(transaction.amount).toBeInTheDocument();
  });

  it('Renders with a type field', () => {
    const { transaction } = renderCreateView();

    expect(transaction.type).toBeInTheDocument();
  });

  it('Can accept a value for date', () => {
    const { transaction } = renderCreateView();

    userEvent.type(transaction.date, '2021-06-01');

    expect(transaction.date.value).toBe('2021-06-01');
  });

  it('Can accept multiple values for type', () => {
    const { transaction } = renderCreateView();

    userEvent.selectOptions(transaction.type, ['Rent', 'Subscription']);

    expect(Array.from(transaction.type.selectedOptions, option => option.value)).toEqual([
      'Rent',
      'Subscription'
    ]);
  });

  it('Can click the create transaction button', async () => {
    const initialStore = store.getState();
    const { transaction, create } = renderCreateView();

    userEvent.type(transaction.date, '2021-06-01');
    userEvent.type(transaction.amount, '');
    userEvent.click(create);

    await waitFor(() => expect(store.getState()).toEqual(initialStore));
  });

  it('Can click the create transaction button with valid values', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 201, data: { id: 'id' } });

    const initialStore = store.getState();
    const { transaction, create } = renderCreateView();

    userEvent.type(transaction.name, 'name');
    userEvent.type(transaction.amount, '1');
    userEvent.click(create);

    await waitFor(() => expect(store.getState()).not.toEqual(initialStore));
  });

  it('Can click the create transaction button with valid values but fail the API call', async () => {
    const initialStore = store.getState();
    const { transaction, create } = renderCreateView();

    userEvent.type(transaction.name, 'name');
    userEvent.type(transaction.amount, '1');
    userEvent.click(create);

    await waitFor(() => expect(store.getState()).toEqual(initialStore));
  });

  it('Can click the cancel button, which calls the hide prop', async () => {
    const { hidden, cancel } = renderCreateView();

    userEvent.click(cancel);

    await waitFor(() => expect(hidden.value).toBeTruthy());
  });
});
