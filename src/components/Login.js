import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Link, useHistory } from "react-router-dom"
import { ErrorText } from "../styled-components/FormStyledComponents"
import { passwordValidator, emailValidator } from "../utils/Validators"
import { stateContext } from "../stateReducer"
import { Heading } from "react-bulma-components"
import FormContainer from "./shared/FormContainer"

const loginFailureMessages = {
  unauthorised: "Username or password incorrect",
  other: "Something went wrong. Try logging in again.",
}

const Login = () => {
  const [loginFailureMessage, setLoginFailureMessage] = useState()
  const { dispatch } = useContext(stateContext)

  const history = useHistory()
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Handle login form submission
  const onSubmit = (data) => {
    // Post form data to login route
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/users/login`, data)
      .then((response) => {
        // Update state context with token and user details from API response
        dispatch({
          type: "login",
          session: { token: response.data.token, user: response.data.user },
        })
        // Remove login failure message on successful login
        setLoginFailureMessage(null)
        // Redirect to home
        history.push("/")
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        error.response?.status === 401
          ? setLoginFailureMessage(loginFailureMessages.unauthorised)
          : setLoginFailureMessage(loginFailureMessages.other)
      })
  }

  return (
    <FormContainer>
      <Heading className="has-text-centered mt-5">Login</Heading>
      <form onSubmit={handleSubmit(onSubmit)} id="loginForm" />
      <label htmlFor="email" className="has-text-weight-bold is-size-5">
        Email
      </label>
      <input
        className="input is-medium has-background-grey-lighter"
        style={{ borderRadius: "1rem", width: "50%", minWidth: "20rem" }}
        type="text"
        id="email"
        form="loginForm"
        {...register("email", emailValidator)}
        autoFocus
      />
      {errors.email && <ErrorText>Invalid email address</ErrorText>}
      <label htmlFor="password" className="has-text-weight-bold is-size-5 mt-3">
        Password
      </label>
      <input
        className="input is-medium has-background-grey-lighter"
        style={{ borderRadius: "1rem", width: "50%", minWidth: "20rem" }}
        type="password"
        id="password"
        form="loginForm"
        {...register("password", passwordValidator)}
      />
      {errors.password && <ErrorText>Invalid password</ErrorText>}
      {loginFailureMessage && (
        <ErrorText>Login failed: {loginFailureMessage}</ErrorText>
      )}
      <div className="mt-4">
        <Link to="/" className="button has-background-danger has-text-white has-text-weight-bold mx-1" style={{ borderRadius: "0.6rem" }}>Cancel</Link>
        <input
          type="submit"
          form="loginForm"
          className="button has-background-primary-dark has-text-white has-text-weight-bold mx-1"
          style={{ borderRadius: "0.6rem" }}
          value="Login"
        />
      </div>
    </FormContainer>
  )
}

export default Login
