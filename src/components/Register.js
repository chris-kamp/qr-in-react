import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { PageHeader } from "../styled-components/GeneralStyledComponents"
import { ErrorText } from "../styled-components/FormStyledComponents"
import {
  usernameValidator,
  passwordValidator,
  emailValidator,
} from "../utils/Validators"
import { stateContext } from "../stateReducer"

const Register = () => {
  const [signupFailureMessage, setSignupFailureMessage] = useState()
  const history = useHistory()
  const { dispatch } = useContext(stateContext)
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
      .post(`${process.env.REACT_APP_API_ENDPOINT}/users/register`, data)
      .then((response) => {
        // Update state context with token and user details from API response
        console.log(response.data)
        dispatch({
          type: "login",
          session: { token: response.data.token, user: response.data.user },
        })
        // Remove signup failure message on successful signup
        setSignupFailureMessage(null)
        // Redirect to home
        history.push("/")
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        setSignupFailureMessage("Something went wrong. Try signing up again.")
        console.log(errors)
      })
  }

  return (
    <>
      <PageHeader>Register</PageHeader>
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", usernameValidator)}
          />
          {errors.username && <ErrorText>Invalid username</ErrorText>}
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
        {signupFailureMessage && (
          <ErrorText>Login failed: {signupFailureMessage}</ErrorText>
        )}
        <input type="submit" />
      </form>
    </>
  )
}

export default Register
