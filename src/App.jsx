import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import React from 'react';
import Signup from './components/auth/Signup'

const App = () => {
  return (
    <Router>
      <div className='bg-slate-950 h-screen w-screen'>
        <Switch>
          <Route exact path="/">
            <Redirect to="/signup" />
          </Route>
          <Route path="/signup" component={Signup} />
        </Switch>
      </div>
    </Router>
  )
}

export default App