import { renderComponent, waitFor } from '../utils';
import { Home } from '../../pages';
import store, { Transaction } from '../../store';
import userEvent from '@testing-library/user-event';

const renderHome = () => {
  const home = renderComponent(<Home />);
  const cancel = home.queryByLabelText('cancel create') as HTMLButtonElement | null;
  const createNew = home.queryByLabelText('create new transaction') as HTMLButtonElement | null;
  const view = home.getByLabelText('transaction dashboard') as HTMLTableElement;

  return { home, cancel, createNew, view };
};

describe('Home page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    store.dispatch(Transaction.actions.set([{ id: '1' }]));
  });

  it("Renders a button labeled 'create new transaction ' by default", () => {
    const { cancel, createNew, view } = renderHome();

    expect(cancel).not.toBeInTheDocument();
    expect(createNew).toBeInTheDocument();
    expect(view).toBeInTheDocument();
  });

  it('Clicking the create transaction button shows the page', () => {
    const { createNew, home } = renderHome();

    userEvent.click(createNew!);

    expect(home.getByLabelText('cancel create')).toBeInTheDocument();
  });

  it('Clicking the cancel button will display the create transaction button again', () => {
    const { createNew, home } = renderHome();

    userEvent.click(createNew!);

    const cancel = home.getByLabelText('cancel create');

    userEvent.click(cancel);

    expect(home.queryByLabelText('cancel create')).not.toBeInTheDocument();
  });
});
