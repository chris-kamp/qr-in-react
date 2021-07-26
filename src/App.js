import React, { useReducer } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Businesses from "./components/businesses/Businesses"
import Business from "./components/businesses/Business"
import NewBusiness from "./components/businesses/NewBusiness"
import EditBusiness from "./components/businesses/EditBusiness"
import Checkin from "./components/checkin/Checkin"
import NewPromotion from "./components/promotions/NewPromotion"
import Promotions from "./components/promotions/Promotions"
import Login from "./components/Login"
import Profile from "./components/profile/Profile"
import Register from "./components/Register"
import stateReducer, { stateContext } from "./stateReducer"
import "bulma/css/bulma.min.css"
import Nav from "./components/Nav"
import Alerts from "./components/alerts/Alerts"

function App() {
  const [store, dispatch] = useReducer(stateReducer, {
    session: JSON.parse(localStorage.getItem("session")),
    alerts: [],
    backPath: "",
  })

  return (
    <stateContext.Provider value={{ ...store, dispatch }}>
      <Router>
        <Nav />
        <Alerts />
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
          <Route exact path="/businesses/:id/edit">
            <EditBusiness />
          </Route>
          <Route exact path="/businesses/:id/checkin">
            <Checkin />
          </Route>
          <Route exact path="/businesses/:id/promotions/new">
            <NewPromotion />
          </Route>
          <Route exact path="/promotions">
            <Promotions />
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
