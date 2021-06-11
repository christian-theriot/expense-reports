import { render } from '@testing-library/react';
import { Update } from '../../../pages/transaction';

describe('Update Transaction page', () => {
  afterEach(() => jest.restoreAllMocks());

  it('Renders', () => {
    expect(render(<Update />)).toBeDefined();
  });
});
