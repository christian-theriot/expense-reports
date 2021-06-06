import { User } from '../../src/models';
import { Database } from '../../src/services';

describe('User model', () => {
  beforeAll(async () => {
    await Database.connect();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Database.disconnect();
  });

  it('Can refuse to create a user if given an invalid password', async () => {
    try {
      await new User({
        username: 'test',
        password: 'invalid'
      }).save();
    } catch (err) {
      expect(err.message).toBe(
        'User validation failed: password: Cast to String failed for value "invalid" (type string) at path "password"'
      );
    }
  });

  it('Can create a user given a valid password', async () => {
    const user = await new User({
      username: 'test',
      password: '$Ecr3t1234'
    }).save();

    expect(user.username).toBe('test');
    expect(user.password).not.toBe('$Ecr3t1234');
  });

  it("Can validate the user's original password", async () => {
    const user = await User.findOne({ username: 'test' });

    expect(user?.authenticate('$Ecr3t1234')).toBeTruthy();
  });
});
