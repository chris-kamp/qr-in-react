import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { ErrorText } from "../styled-components/FormStyledComponents"
import { loginPasswordValidator, emailValidator } from "../utils/Validators"
import { stateContext } from "../stateReducer"
import FormContainer from "./shared/FormContainer"
import Input from "./shared/Input"
import InputLabel from "./shared/InputLabel"
import FormButtonGroup from "./shared/FormButtonGroup"
import PageHeading from "./shared/PageHeading"

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
