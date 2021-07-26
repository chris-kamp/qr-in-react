import { Navbar, Button } from "react-bulma-components"
import { Link, useHistory, useLocation } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { stateContext } from "../stateReducer"
import { flashNotice } from "../utils/Utils"

const Nav = () => {
  const [dropdownActive, setDropdownActive] = useState(false)
  const toggleDropdown = () => setDropdownActive(!dropdownActive)
  const { session, dispatch } = useContext(stateContext)
  const history = useHistory()
  const location = useLocation()

  // On route change, push previous location to "backPath". Used to redirect back to previous location (only within the site) following certain actions.
  useEffect(() => {
    const unlisten = history.listen(() => {
      dispatch({
        type: "setBackPath",
        backPath: location.pathname,
      })
    })
    return () => {
      unlisten()
    }
  }, [history, location, dispatch])

  const logOut = () => {
    dispatch({
      type: "logout",
    })
    // On logout, redirect to home and notify user of successful logout
    flashNotice(dispatch, "Logged out successfully")
    history.push("/")
  }

  return (
    <Navbar className="is-light" active={dropdownActive}>
      <Navbar.Brand>
        <Navbar.Item renderAs={Link} to="/" className="has-text-weight-bold">
          QR-IN
        </Navbar.Item>
        <Navbar.Burger onClick={toggleDropdown} />
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item renderAs={Link} to="/">
            Home
          </Navbar.Item>
          <Navbar.Item renderAs={Link} to="/businesses">
            Browse
          </Navbar.Item>
          <Navbar.Item renderAs={Link} to="/promotions">
            Promotions
          </Navbar.Item>
          {session && (
            <Navbar.Item renderAs={Link} to={`/users/${session.user.id}`}>
              My Profile
            </Navbar.Item>
          )}
        </Navbar.Container>
        <Navbar.Container align="end" className="is-flex">
          {session && (
            <Navbar.Item className="has-text-weight-bold" renderAs="span">
              {session.user.username}
            </Navbar.Item>
          )}
        </Navbar.Container>
        <Navbar.Container className="is-flex" align="end">
          {!session && (
            <>
              <Navbar.Item
                renderAs={Link}
                to="/login"
                className="button has-background-grey has-text-white my-auto mx-2"
                style={{ maxWidth: "5rem" }}
              >
                Login
              </Navbar.Item>
              <Navbar.Item
                renderAs={Link}
                to="/register"
                className="button has-background-primary has-text-white my-auto mx-2"
                style={{ maxWidth: "5rem" }}
              >
                Sign Up
              </Navbar.Item>
            </>
          )}
          {session && (
            <Navbar.Item
              renderAs={Button}
              className="button has-background-dark has-text-white my-auto mx-2"
              onClick={logOut}
            >
              Log Out
            </Navbar.Item>
          )}
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  )
}

export default Nav
