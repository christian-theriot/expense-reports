import { render } from '@testing-library/react';
import { Create } from '../../../pages/transaction';

describe('Create Transaction page', () => {
  afterEach(() => jest.restoreAllMocks());

  it('Renders', () => {
    expect(render(<Create />)).toBeDefined();
  });
});
