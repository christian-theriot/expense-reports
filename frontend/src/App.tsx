import * as Page from './pages';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route
        exact
        path='/'
        component={() => {
          return null;
        }}
      />
      <Route path='/login' component={Page.Login} />
      <Route path='/register' component={Page.Register} />
    </Switch>
  );
}

export default App;
