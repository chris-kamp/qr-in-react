import { useState, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import ErrorText from "./shared/ErrorText"
import { loginPasswordValidator, emailValidator } from "../utils/Validators"
import { stateContext } from "../stateReducer"
import FormContainer from "./shared/FormContainer"
import Input from "./shared/Input"
import InputLabel from "./shared/InputLabel"
import FormButtonGroup from "./shared/FormButtonGroup"
import PageHeading from "./shared/PageHeading"
import { flashError, flashNotice, goBack } from "../utils/Utils"

const loginFailureMessages = {
  unauthorised: "Username or password incorrect",
  other: "Something went wrong. Try logging in again.",
}

const Login = () => {
  const [loginFailureMessage, setLoginFailureMessage] = useState()
  const { dispatch, backPath, session } = useContext(stateContext)

  const history = useHistory()
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Redirect back to previous page if user is already logged in
  useEffect(() => {
    // Do nothing if user not logged in
    if (!session) return
    flashError(dispatch, "You are already logged in")
    // Redirect back to last page or to home. Do not redirect to login or register pages to prevent infinite loop.
    goBack(backPath, history, ["/login", "/register"])
  }, [backPath, dispatch, history, session])

  // Handle login form submission
  const onSubmit = (data) => {
    // Post form data to login route
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/users/login`, data)
      .then((response) => {
        // Redirect back to last page or to home. Do not redirect to login or register pages to prevent infinite loop.
        goBack(backPath, history, ["/login", "/register"])
        // Update state context with token and user details from API response
        dispatch({
          type: "login",
          session: { token: response.data.token, user: response.data.user },
        })
        // Flash alert for succcessful login
        flashNotice(dispatch, `You are now logged in as ${response.data.user.username}`)
        // Remove login failure message on successful login
        setLoginFailureMessage(null)
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
      <PageHeading>Login</PageHeading>
      <form onSubmit={handleSubmit(onSubmit)} id="loginForm" />
      <InputLabel htmlFor="email" text="Email" isFirst />
      <Input
        register={register}
        name="email"
        validator={emailValidator}
        placeholder="email@example.com"
        form="loginForm"
        focus
      />
      {errors.email && <ErrorText>Please enter a valid email address</ErrorText>}
      <InputLabel htmlFor="password" text="Password" />
      <Input
        type="password"
        name="password"
        form="loginForm"
        register={register}
        validator={loginPasswordValidator}
        placeholder="Password"
      />
      {errors.password && <ErrorText>Please enter your password</ErrorText>}
      {loginFailureMessage && (
        <ErrorText>Login failed: {loginFailureMessage}</ErrorText>
      )}
      <FormButtonGroup form="loginForm" submitValue="Login" />
    </FormContainer>
  )
}

export default Login
