import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';

// allow client code to import waitFor while importing renderComponent
export { waitFor } from '@testing-library/react';

export const renderComponent = (
  Component: JSX.Element,
  path: string = '/',
  test?: { location?: any; history?: any }
) => {
  const component = render(
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

  return { component };
};
