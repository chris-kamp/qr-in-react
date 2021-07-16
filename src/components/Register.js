import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { PageHeader } from "../styled-components/GeneralStyledComponents"
import { ErrorText } from "../styled-components/FormStyledComponents"

const Register = () => {
  const [signupFailureMessage, setSignupFailureMessage] = useState()
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
      .post(`${process.env.REACT_APP_API_ENDPOINT}/users/register`, data)
      .then((response) => {
        // Set "session" in localstorage with token from response
        localStorage.setItem("session", response.data.token)
        // Remove signup failure message on successful signup
        setSignupFailureMessage(null)
        // Redirect to home
        history.push("/")
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        setSignupFailureMessage("Something went wrong. Try signing up again.")
      })
  }

  return (
    <>
      <PageHeader>Register</PageHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" {...register("email")} />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username")} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
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
