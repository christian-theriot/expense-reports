import { View } from '../../../pages/transaction';
import store, { Transaction, TransactionType } from '../../../store';
import { renderComponent } from '../../utils';

const renderView = () => {
  const { component } = renderComponent(<View />);

  return { view: component };
};

describe('View Transactions page', () => {
  beforeEach(() => {
    store.dispatch(
      Transaction.actions.set([
        {
          date: '2021-06-01',
          name: 'Rent Payment',
          amount: -1877,
          type: [TransactionType.Rent]
        }
      ])
    );
  });
  afterEach(() => jest.restoreAllMocks());

  it('Renders nothing if no transaction is present', () => {
    store.dispatch(Transaction.actions.clear());

    const { view } = renderView();
    const table = view.queryByLabelText('transaction dashboard');

    expect(table).not.toBeInTheDocument();
  });

  it('Renders each transaction with an identifying label', () => {
    store.dispatch(
      Transaction.actions.set([
        {
          date: '2021-06-01',
          name: 'Rent Payment',
          type: ['Rent'],
          amount: -1800
        }
      ])
    );

    const { view } = renderView();
    const transactionRow = view.getByLabelText('view-txa-0');
    const transaction = {
      date: transactionRow.children.item(0)?.textContent,
      name: transactionRow.children.item(1)?.textContent,
      amount: transactionRow.children.item(2)?.textContent,
      type: transactionRow.children.item(3)?.textContent
    };

    expect(transactionRow).toBeInTheDocument();
    expect(transaction).toEqual({
      date: '2021-06-01',
      name: 'Rent Payment',
      amount: '-1800',
      type: 'Rent'
    });
  });

  it('Renders date as pending if undefined', () => {
    store.dispatch(
      Transaction.actions.set([
        {
          name: 'Spotify Premium',
          amount: -5,
          type: ['Entertainment']
        }
      ])
    );

    const { view } = renderView();
    const transactionRow = view.getByLabelText('view-txa-0');
    const transaction = {
      date: transactionRow.children.item(0)?.textContent,
      name: transactionRow.children.item(1)?.textContent,
      amount: transactionRow.children.item(2)?.textContent,
      type: transactionRow.children.item(3)?.textContent
    };

    expect(transactionRow).toBeInTheDocument();
    expect(transaction).toEqual({
      date: 'Pending',
      name: 'Spotify Premium',
      amount: '-5',
      type: 'Entertainment'
    });
  });

  it('Renders multiple types as a comma-separated string', () => {
    store.dispatch(
      Transaction.actions.set([
        {
          name: 'Spotify Premium',
          amount: -5,
          type: ['Entertainment', 'Subscription']
        }
      ])
    );

    const { view } = renderView();
    const transactionRow = view.getByLabelText('view-txa-0');
    const transaction = {
      date: transactionRow.children.item(0)?.textContent,
      name: transactionRow.children.item(1)?.textContent,
      amount: transactionRow.children.item(2)?.textContent,
      type: transactionRow.children.item(3)?.textContent
    };

    expect(transactionRow).toBeInTheDocument();
    expect(transaction).toEqual({
      date: 'Pending',
      name: 'Spotify Premium',
      amount: '-5',
      type: 'Entertainment, Subscription'
    });
  });

  it('Renders type as empty if undefined', () => {
    store.dispatch(
      Transaction.actions.set([
        {
          name: 'No type',
          amount: 1
        }
      ])
    );

    const { view } = renderView();
    const transactionRow = view.getByLabelText('view-txa-0');
    const transaction = {
      date: transactionRow.children.item(0)?.textContent,
      name: transactionRow.children.item(1)?.textContent,
      amount: transactionRow.children.item(2)?.textContent,
      type: transactionRow.children.item(3)?.textContent
    };

    expect(transactionRow).toBeInTheDocument();
    expect(transaction).toEqual({
      date: 'Pending',
      name: 'No type',
      amount: '1',
      type: ''
    });
  });
});
