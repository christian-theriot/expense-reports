import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import * as API from '../api';

export const Logout = withRouter(function Logout(props) {
  useEffect(() => {
    API.User.logout().then(() => {
      props.history.push('/');
    });
  }, [props.history]);

  return null;
});
