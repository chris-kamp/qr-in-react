import { Navbar, Button } from "react-bulma-components"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { stateContext } from "../stateReducer"

const Nav = () => {
  const [dropdownActive, setDropdownActive] = useState(false)
  const toggleDropdown = () => setDropdownActive(!dropdownActive)
  const { session, dispatch } = useContext(stateContext)

  const logOut = () => {
    dispatch({
      type: "logout",
    })
  }

  return (
    <Navbar className="is-light" active={dropdownActive}>
      <Navbar.Brand>
        <Navbar.Item className="has-text-weight-bold">
          <span className="is-size-4">QR-IN</span>
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
