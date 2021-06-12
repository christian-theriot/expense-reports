import { renderComponent, waitFor } from '../utils';
import { Home } from '../../pages';
import store, { Transaction } from '../../store';
import userEvent from '@testing-library/user-event';

describe('Home page', () => {
  beforeEach(() => jest.restoreAllMocks());

  it('Renders the New... button by default', () => {
    const { component } = renderComponent(<Home />);
    const newButton = component.getByLabelText('create new transaction');

    expect(newButton).toBeInTheDocument();
  });

  it('Renders the create page on clicking the button', async () => {
    const { component } = renderComponent(<Home />);
    const newButton = component.getByLabelText('create new transaction');

    userEvent.click(newButton);

    await waitFor(() => expect(component.getByLabelText('cancel create')).toBeInTheDocument());
  });

  it('Renders the New... button when clicking cancel', async () => {
    const { component } = renderComponent(<Home />);
    let newButton = component.getByLabelText('create new transaction');

    userEvent.click(newButton);

    const cancelButton = component.getByLabelText('cancel create');

    userEvent.click(cancelButton);

    newButton = component.getByLabelText('create new transaction');
    await waitFor(() => expect(newButton).toBeInTheDocument());
  });
});
