import { Mock, renderComponent, waitFor } from '../../utils';
import { Update } from '../../../pages';
import store, { State, Transaction, User } from '../../../store';
import userEvent from '@testing-library/user-event';

const renderUpdate = (id: string) => {
  let hidden_ = false;
  const output = {
    hide: () => (hidden_ = true),
    hidden: () => hidden_
  };

  const update = renderComponent(
    <table>
      <tbody>
        <Update id={id} hide={output.hide} />
      </tbody>
    </table>
  );
  const date = update.queryByLabelText('date') as HTMLInputElement | null;
  const name = update.queryByLabelText('name') as HTMLInputElement | null;
  const amount = update.queryByLabelText('amount') as HTMLInputElement | null;
  const type = update.queryByLabelText('type') as HTMLSelectElement | null;
  const button = {
    update: update.queryByLabelText('update transaction') as HTMLButtonElement | null,
    cancel: update.getByLabelText('cancel update') as HTMLButtonElement
  };

  return {
    update,
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

describe('Update transaction page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    store.dispatch(Transaction.actions.set([{ id: 'id' }]));
  });

  it("Renders inputs labeled 'date', 'name', 'amount', and 'type'", () => {
    const { transaction, output } = renderUpdate('id');

    [transaction.date, transaction.name, transaction.amount, transaction.type].forEach(element =>
      expect(element).toBeInTheDocument()
    );
    expect(output.hidden()).toBeFalsy();
  });

  it('Accepts user input', () => {
    const { transaction } = renderUpdate('id');

    userEvent.type(transaction.amount!, '1');

    expect(transaction.amount!.value).toBe('1');
  });

  it('Accepts multiple options in type', () => {
    const { transaction } = renderUpdate('id');

    userEvent.selectOptions(transaction.type!, ['Rent', 'Subscription']);

    expect(Array.from(transaction.type!.selectedOptions, option => option.value)).toEqual([
      'Rent',
      'Subscription'
    ]);
  });

  it('Can click the update button, and amount should be NaN', () => {
    jest.spyOn(global, 'isNaN');
    const { button } = renderUpdate('id');

    userEvent.click(button.update!);

    expect(global.isNaN).toBeCalledWith(NaN);
  });

  it('Can click the update button, calling API.Transaction.update', async () => {
    Mock.API.Success.OK('post');
    const { transaction, button, output } = renderUpdate('id');

    userEvent.type(transaction.amount!, '1');
    userEvent.type(transaction.date!, '2021-06-01');

    await waitFor(() => {
      userEvent.click(button.update!);

      expect(output.hidden()).toBeTruthy();
      expect(State.current.transactions).toEqual([
        { id: 'id', amount: 1, date: '2021-06-01', type: [] }
      ]);
    });
  });

  it('Can click the update button, receiving an error', async () => {
    store.dispatch(Transaction.actions.set([{ id: 'id', name: 'name', amount: '1' }]));
    Mock.API.Error.Unauthorized('post');
    const { button, output } = renderUpdate('id');

    await waitFor(() => {
      userEvent.click(button.update!);

      expect(output.hidden()).toBeFalsy();
      expect(State.current.transactions).toEqual([{ id: 'id', name: 'name', amount: '1' }]);
    });
  });

  it('Can click the cancel button, calling props.hide', () => {
    const { button, output } = renderUpdate('id');

    userEvent.click(button.cancel);

    expect(output.hidden()).toBeTruthy();
  });

  it('Renders transaction does not exist and cancel button when an invalid id is given', () => {
    store.dispatch(Transaction.actions.clear());
    const { button } = renderUpdate('invalid');

    expect(button.update).not.toBeInTheDocument();
    expect(button.cancel).toBeInTheDocument();
  });
});
