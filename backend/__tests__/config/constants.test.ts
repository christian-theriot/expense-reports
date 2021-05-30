import { Constants } from '../../src/config';

describe('Constants namespace', () => {
  it('Defines a PORT', () => {
    expect(Constants.PORT).toBeDefined();
  });

  it('Defines a SESSION_SECRET', () => {
    expect(Constants.SESSION_SECRET).toBeDefined();
  });

  it('Defines a FRONTEND', () => {
    expect(Constants.FRONTEND).toBeDefined();
  });

  it('Defines a DATABASE_URL', () => {
    expect(Constants.DATABASE_URL).toBeDefined();
  });

  it('Defines a PRODUCTION', () => {
    expect(Constants.PRODUCTION).toBeDefined();
  });

  it('Defines a SESSION_TIMEOUT', () => {
    expect(Constants.SESSION_TIMEOUT).toBeDefined();
  });
});