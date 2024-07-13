import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Chatbox from "./components/chats/Chatbox";
import Login from "./components/auth/Login";
import React from 'react';
import Signup from './components/auth/Signup'

const App = () => {
  return (
    <Router>
      <div className='bg-gray-900 h-svh w-screen overflow-y-auto'>
        <Switch>
          <Route exact path="/">
            <Redirect to="/signup" />
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/chat" component={Chatbox} />
        </Switch>
      </div>
    </Router>
  )
}

export default App