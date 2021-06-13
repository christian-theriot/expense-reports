import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';

export { waitFor } from '@testing-library/react';

export const renderComponent = (
  Component: JSX.Element,
  path: string = '/',
  test?: { history?: any; location?: any }
) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        {Component}
        {test && (
          <Route
            path='*'
            render={({ history, location }) => {
              test.history = history;
              test.location = location;
              return null;
            }}
          />
        )}
      </MemoryRouter>
    </Provider>
  );
