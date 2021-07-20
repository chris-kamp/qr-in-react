import React, { useReducer, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Businesses from "./components/businesses/Businesses"
import Business from "./components/businesses/Business"
import NewBusiness from "./components/businesses/NewBusiness"
import Checkin from "./components/Checkin"
import Login from "./components/Login"
import Profile from "./components/Profile"
import Register from "./components/Register"
import stateReducer, { stateContext } from "./stateReducer"
import "bulma/css/bulma.min.css"
import Nav from "./components/Nav"

function App() {
  const [store, dispatch] = useReducer(stateReducer, {
    session: JSON.parse(localStorage.getItem("session")),
  })

  return (
    <stateContext.Provider value={{ ...store, dispatch }}>
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/businesses">
            <Businesses />
          </Route>
          <Route exact path="/businesses/new">
            <NewBusiness />
          </Route>
          <Route exact path="/businesses/:id">
            <Business />
          </Route>
          <Route exact path="/businesses/:id/checkin">
            <Checkin />
          </Route>
          <Route exact path="/users/:id">
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
    </stateContext.Provider>
  )
}

export default App
