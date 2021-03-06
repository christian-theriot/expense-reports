import * as Page from './pages';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Page.Menu />
      <Switch>
        <Route exact path='/' component={Page.Home} />
        <Route path='/login' component={Page.Login} />
        <Route path='/register' component={Page.Register} />
        <Route path='/logout' component={Page.Logout} />
      </Switch>
    </>
  );
}

export default App;
