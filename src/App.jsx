import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Login from "./components/auth/Login";
import React from 'react';
import Signup from './components/auth/Signup'

const App = () => {
  return (
    <Router>
      <div className='bg-gray-900 h-screen w-screen'>
        <Switch>
          <Route exact path="/">
            <Redirect to="/signup" />
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    </Router>
  )
}

export default App