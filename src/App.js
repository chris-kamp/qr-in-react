import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from './components/Home';
import Businesses from './components/Businesses';
import Business from './components/Business';
import Checkin from './components/Checkin';
import Login from './components/Login';
import NewBusiness from './components/NewBusiness';
import Profile from './components/Profile';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/businesses">
          <Businesses />
        </Route>
        <Route exact path="/business/:id">
          <Business />
        </Route>
        <Route exact path="/business/:id/checkin">
          <Checkin />
        </Route>
        <Route exact path="/business/new">
          <NewBusiness />
        </Route>
        <Route exact path="/user/:id">
          <Profile />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
