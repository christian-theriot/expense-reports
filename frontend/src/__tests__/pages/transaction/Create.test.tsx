import { Mock, renderComponent, waitFor } from '../../utils';
import { Create } from '../../../pages';
import store, { State, Transaction, User } from '../../../store';
import userEvent from '@testing-library/user-event';

const renderCreate = () => {
  let hidden_ = false;
  const output = {
    hide: () => (hidden_ = true),
    hidden: () => hidden_
  };

  const create = renderComponent(<Create hide={output.hide} />);
  const date = create.getByLabelText('date') as HTMLInputElement;
  const name = create.getByLabelText('name') as HTMLInputElement;
  const amount = create.getByLabelText('amount') as HTMLInputElement;
  const type = create.getByLabelText('type') as HTMLSelectElement;
  const button = {
    create: create.getByLabelText('create transaction') as HTMLButtonElement,
    cancel: create.getByLabelText('cancel create') as HTMLButtonElement
  };

  return {
    create,
    transaction: {
      date,
      name,
      amount,
      type
    },
    button,
    output
  };
};

describe('Create transaction page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    store.dispatch(Transaction.actions.clear());
    store.dispatch(User.actions.clear());
  });

  it("Renders inputs labeled 'date', 'name', 'amount', and 'type'", () => {
    const { transaction, output } = renderCreate();

    [transaction.date, transaction.name, transaction.amount, transaction.type].forEach(element =>
      expect(element).toBeInTheDocument()
    );
    expect(transaction.date).toBeInTheDocument();
    expect(output.hidden()).toBeFalsy();
  });

  it('Accepts user input', () => {
    const { transaction } = renderCreate();

    userEvent.type(transaction.date, '2021-06-01');

    expect(transaction.date.value).toBe('2021-06-01');
  });

  it('Accepts multiple options in type', () => {
    const { transaction } = renderCreate();

    userEvent.selectOptions(transaction.type, ['Rent', 'Subscription']);

    expect(Array.from(transaction.type.selectedOptions, option => option.value)).toEqual([
      'Rent',
      'Subscription'
    ]);
  });

  it('Can click the create button, and amount should be NaN', () => {
    jest.spyOn(global, 'parseFloat');
    const { button } = renderCreate();

    userEvent.click(button.create);
    expect(parseFloat).toReturnWith(NaN);
  });

  it('Can click the create button, calling API.Transaction.create', async () => {
    Mock.API.Success.CreatedResource('post', [{ id: 'id', name: 'name' }]);
    const { transaction, button } = renderCreate();

    userEvent.type(transaction.name, 'name');
    userEvent.type(transaction.amount, '1');
    userEvent.type(transaction.date, '2021-06-01');
    userEvent.selectOptions(transaction.type, ['Rent']);

    await waitFor(() => {
      userEvent.click(button.create);

      expect(transaction.name.value).toBe('');
      expect(transaction.amount.value).toBe('');
      expect(State.current.transactions).toEqual([
        { id: 'id', name: 'name', amount: 1, type: ['Rent'], date: '2021-06-01' }
      ]);
      expect(State.current.user.transactions).toEqual(['id']);
    });
  });

  it('Can click the create button, receiving an error', async () => {
    Mock.API.Error.Unauthorized('post');
    const { transaction, button } = renderCreate();

    userEvent.type(transaction.name, 'name');
    userEvent.type(transaction.amount, '1');

    await waitFor(() => {
      userEvent.click(button.create);

      expect(transaction.name).not.toBe('');
      expect(transaction.amount).not.toBe('');
    });
  });

  it('Can click the cancel button, calling props.hide', () => {
    const { button, output } = renderCreate();

    userEvent.click(button.cancel);

    expect(output.hidden()).toBeTruthy();
  });
});
