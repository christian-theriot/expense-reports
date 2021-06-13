import { Mock, renderComponent, waitFor } from '../../utils';
import { View } from '../../../pages';
import store, { State, Transaction, User } from '../../../store';
import userEvent from '@testing-library/user-event';

const renderView = () => {
  const view = renderComponent(<View />);
  const table = view.queryByLabelText('transaction dashboard') as HTMLTableElement | null;
  const viewTxa0 = view.queryByLabelText('view-txa-0') as HTMLTableRowElement | null;
  const update = view.queryByLabelText('update') as HTMLButtonElement | null;
  const cancel = view.queryByLabelText('cancel update') as HTMLButtonElement | null;

  return { view, table, viewTxa0, update, cancel };
};

describe('View transactions page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    store.dispatch(
      Transaction.actions.set([
        { id: '1', name: 'name', amount: 1, type: ['Rent', 'Subscription'] }
      ])
    );
  });

  it("Renders a table labeled 'transaction dashboard'", () => {
    const { table } = renderView();

    expect(table).toBeInTheDocument();
  });

  it("Renders a row labeled 'view-txa-0'", () => {
    const { viewTxa0 } = renderView();

    expect(viewTxa0).toBeInTheDocument();
  });

  it("Renders a button labeled 'update'", () => {
    const { update } = renderView();

    expect(update).toBeInTheDocument();
  });

  it('Can click the update button, which switches the row to an update transaction page', () => {
    store.dispatch(Transaction.actions.set([{ id: '1', date: '2021-06-01' }]));
    const { view, update } = renderView();

    userEvent.click(update!);

    expect(view.getByLabelText('cancel update')).toBeInTheDocument();
  });

  it('Clicking cancel switches the row back to a read-only representation', () => {
    store.dispatch(Transaction.actions.set([{ id: '1', date: '2021-06-01' }]));
    const { view, update } = renderView();

    userEvent.click(update!);

    const cancel = view.getByLabelText('cancel update');

    userEvent.click(cancel);

    expect(view.queryByLabelText('cancel update')).not.toBeInTheDocument();
  });

  it("Renders 'No transactions to display at this time' when there are no transactions", () => {
    store.dispatch(Transaction.actions.clear());

    const { table, viewTxa0, update, cancel } = renderView();

    [table, viewTxa0, update, cancel].forEach(element => expect(element).not.toBeInTheDocument());
  });
});
