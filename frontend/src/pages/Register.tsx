import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import * as API from '../api';
import { useDispatch } from 'react-redux';
import { User } from '../store';

export const Register = withRouter(function Register(props) {
  const [user, setUser] = useState<{ username: string; password: string; confirmPassword: string }>(
    {
      username: '',
      password: '',
      confirmPassword: ''
    }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    API.User.session().then(res => {
      if (res.status === 200) {
        props.history.push('/');
      }
    });
  }, [dispatch, props.history]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { status, data } = await API.User.register(user.username, user.password);

    if (status === 201) {
      props.history.push('/login');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>User Sign Up</legend>
        <input
          type='text'
          aria-label='username'
          name='username'
          placeholder='username'
          value={user.username}
          onChange={onChange}
        />
        <input
          type='password'
          aria-label='password'
          name='password'
          placeholder='password'
          value={user.password}
          onChange={onChange}
        />
        <input
          type='password'
          aria-label='confirm password'
          name='confirmPassword'
          placeholder='confirm password'
          value={user.confirmPassword}
          onChange={onChange}
        />
        <button aria-label='sign up' type='submit'>
          Sign Up
        </button>
      </fieldset>
    </form>
  );
});
