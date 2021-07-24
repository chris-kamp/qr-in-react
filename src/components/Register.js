import { useState, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import ErrorText from "./shared/ErrorText"
import {
  usernameValidator,
  passwordValidator,
  emailValidator,
} from "../utils/Validators"
import { stateContext } from "../stateReducer"
import InputLabel from "./shared/InputLabel"
import Input from "./shared/Input"
import FormButtonGroup from "./shared/FormButtonGroup"
import PageHeading from "./shared/PageHeading"
import FormContainer from "./shared/FormContainer"
import { goBack } from "../utils/Utils"

const Register = () => {
  const [signupFailureMessage, setSignupFailureMessage] = useState()
  const history = useHistory()
  const { dispatch, backPath, session } = useContext(stateContext)
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
    // Redirect back to last page or to home. Do not redirect to login or register pages to prevent infinite loop.
    goBack(backPath, history, ["/login", "/register"])
  }, [backPath, dispatch, history, session])

  // Handle login form submission
  const onSubmit = (data) => {
    // Post form data to login route
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/users/register`, data)
      .then((response) => {
        // Redirect back to last page or to home. Do not redirect to login or register pages to prevent infinite loop.
        goBack(backPath, history, ["/login", "/register"])
        // Update state context with token and user details from API response
        dispatch({
          type: "login",
          session: { token: response.data.token, user: response.data.user },
        })
        // Flash alert for succcessful signup
        dispatch({
          type: "pushAlert",
          alert: {
            type: "notice",
            message: `Signup successful! You are now logged in as ${response.data.user.username}`,
          },
        })
        // Remove signup failure message on successful signup
        setSignupFailureMessage(null)
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        setSignupFailureMessage("Something went wrong. Try signing up again.")
        console.log(errors)
      })
  }

  return (
    <FormContainer>
      <PageHeading>Register</PageHeading>
      <form onSubmit={handleSubmit(onSubmit)} id="registerForm" />
      <InputLabel htmlFor="email" text="Email" isFirst />
      <Input
        register={register}
        name="email"
        validator={emailValidator}
        placeholder="email@example.com"
        form="registerForm"
        focus
      />
      {errors.email && <ErrorText>Invalid email address</ErrorText>}

      <InputLabel htmlFor="username" text="Username" />
      <Input
        register={register}
        name="username"
        validator={usernameValidator}
        placeholder="Username"
        form="registerForm"
      />
      {errors.username && <ErrorText>Invalid username</ErrorText>}

      <InputLabel htmlFor="password" text="Password" />
      <Input
        type="password"
        name="password"
        form="registerForm"
        register={register}
        validator={passwordValidator}
        placeholder="Password"
      />
      {errors.password && <ErrorText>Invalid password</ErrorText>}

      {signupFailureMessage && (
        <ErrorText>Signup failed: {signupFailureMessage}</ErrorText>
      )}
      <FormButtonGroup form="registerForm" submitValue="Sign up" />
    </FormContainer>
  )
}

export default Register
