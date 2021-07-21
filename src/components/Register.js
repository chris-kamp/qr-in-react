import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { ErrorText } from "../styled-components/FormStyledComponents"
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
