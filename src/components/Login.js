import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { PageHeader } from "../styled-components/GeneralStyledComponents"
import { ErrorText } from "../styled-components/FormStyledComponents"
import { passwordValidator, emailValidator } from "../utils/Validators"
import { stateContext } from "../stateReducer"

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
    <>
      <PageHeader>Login</PageHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            {...register("email", emailValidator)}
            autoFocus
          />
          {errors.email && <ErrorText>Invalid email address</ErrorText>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", passwordValidator)}
          />
          {errors.password && <ErrorText>Invalid password</ErrorText>}
        </div>
        {loginFailureMessage && (
          <ErrorText>Login failed: {loginFailureMessage}</ErrorText>
        )}
        <input type="submit" />
      </form>
    </>
  )
}

export default Login
