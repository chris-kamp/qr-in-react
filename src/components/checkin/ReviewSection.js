import { Heading } from "react-bulma-components"
import { useEffect, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router"
import { stateContext } from "../../stateReducer"
import axios from "axios"

const ReviewSection = ({ id }) => {
  const [submissionFailureMessage, setSubmissionFailureMessage] = useState()
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
      .post(`${process.env.REACT_APP_API_ENDPOINT}/reviews/create`, data)
      .then((response) => {
        // Update state context with token and user details from API response
        dispatch({
          type: "login",
          session: { token: response.data.token, user: response.data.user },
        })
        // Remove signup failure message on successful signup
        setSubmissionFailureMessage(null)
        // Redirect to home
        history.push(`/businesses/${id}`)
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        setSubmissionFailureMessage("Something went wrong. Please try again shortly.")
        console.log(errors)
      })
  }

  return (
    <>
      <Heading className="is-size-4 mt-4">Leave a review?</Heading>

    </>
  )
}

export default ReviewSection
