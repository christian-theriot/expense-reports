import { Constants } from '../../src/config';

const testConstant = (name: string, value: any, type: string) => {
  test(`Constants.${name} is a ${typeof value}`, () => {
    expect(typeof value).toBe(type);
  });
};

testConstant('PORT', Constants.PORT, 'number');
testConstant('SESSION_SECRET', Constants.SESSION_SECRET, 'string');
testConstant('DATABASE_URL', Constants.DATABASE_URL, 'string');
testConstant('PRODUCTION', Constants.PRODUCTION, 'boolean');
testConstant('SESSION_TIMEOUT', Constants.SESSION_TIMEOUT, 'number');
