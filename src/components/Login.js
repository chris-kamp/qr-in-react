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
import { goBack } from "../utils/Utils"


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
    dispatch({
      type: "pushAlert",
      alert: {
        type: "error",
        message: "You are already logged in",
      },
    })
    goBack(backPath, history)
  })

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
        // Flash alert for succcessful login
        dispatch({
          type: "pushAlert",
          alert: {
            type: "notice",
            message: `You are now logged in as ${response.data.user.username}`,
          },
        })
        // Remove login failure message on successful login
        setLoginFailureMessage(null)
        // Redirect back to last page (or home if none)
        goBack(backPath, history)
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
      {errors.email && <ErrorText>Invalid email address</ErrorText>}
      <InputLabel htmlFor="password" text="Password" />
      <Input
        type="password"
        name="password"
        form="loginForm"
        register={register}
        validator={loginPasswordValidator}
        placeholder="Password"
      />
      {errors.password && <ErrorText>Invalid password</ErrorText>}
      {loginFailureMessage && (
        <ErrorText>Login failed: {loginFailureMessage}</ErrorText>
      )}
      <FormButtonGroup form="loginForm" submitValue="Login" />
    </FormContainer>
  )
}

export default Login
