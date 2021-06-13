import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import * as API from '../api';
import { useDispatch } from 'react-redux';
import { User } from '../store';

export const Login = withRouter(function Login(props) {
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: '',
    password: ''
  });
  const dispatch = useDispatch();

  useEffect(() => {
    API.User.session().then(res => {
      console.log(res);
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

    const { status, data } = await API.User.login(user.username, user.password);
    console.log(data);

    if (status === 200) {
      props.history.push('/');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>User Sign In</legend>
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
        <button aria-label='sign in' type='submit'>
          Sign In
        </button>
      </fieldset>
    </form>
  );
});
