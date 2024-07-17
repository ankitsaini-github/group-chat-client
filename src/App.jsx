import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Chatbox from "./components/chats/Chatbox";
import Groups from "./components/chats/Groups";
import Login from "./components/auth/Login";
import React from 'react';
import Signup from './components/auth/Signup'
import { useSelector } from "react-redux";

const App = () => {
  
  const isLogin = useSelector((state) => state.auth.isloggedin);
  return (
    <Router>
      <div className='bg-gray-100 dark:bg-gray-900 h-svh w-screen overflow-y-auto'>
        <Switch>
          <Route exact path="/">
            {isLogin?<Redirect to="/groups" />:<Redirect to="/signup" />}
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />

          {isLogin && <><Route path="/groups" component={Groups} />
          <Route path="/chat" component={Chatbox} /></>}
        </Switch>
      </div>
    </Router>
  )
}

export default App