import { Heading } from "react-bulma-components"
import { useEffect, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router"
import { stateContext } from "../../stateReducer"
import axios from "axios"
import { reviewContentValidator } from "../../utils/Validators"
import { ErrorText } from "../../styled-components/FormStyledComponents"

const ReviewSection = ({ id, checkinId }) => {
  const [submissionFailureMessage, setSubmissionFailureMessage] = useState()
  const history = useHistory()
  const { session, dispatch } = useContext(stateContext)
  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Handle review form submission
  const onSubmit = (data) => {
    // TODO: If not logged in, should redirect to login (while setting "back" path)
    if (!session) {
      history.push("/login")
      return
    }
    // Post form data to login route
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/reviews`, {...data, checkin_id: checkinId}, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .then(() => {
        // TODO: Display review posting success message
        // Remove failure message on successful submission
        setSubmissionFailureMessage(null)
        // Redirect to business listing
        history.push(`/businesses/${id}`)
      })
      .catch((error) => {
        // TODO: Handle specific errors
        // Display error messages - handles unauthorized, or other uncategorised error
        setSubmissionFailureMessage(
          "Something went wrong. Please try again shortly."
        )
      })
  }

  return (
    <>
      <Heading className="is-size-4 mt-4">Leave a review?</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="radio" id="rating-1" value={1} {...register("rating")} />
          <input type="radio" id="rating-2" value={2} {...register("rating")} />
          <input type="radio" id="rating-3" value={3} {...register("rating")} />
          <input type="radio" id="rating-4" value={4} {...register("rating")} />
          <input type="radio" id="rating-5" value={5} {...register("rating")} />
        </div>
        <div>
          <textarea
            id="content"
            {...register("content", reviewContentValidator)}
            placeholder="Comments (optional)"
          />
          {errors.content && (
            <ErrorText>Comment must not exceed 200 characters</ErrorText>
          )}
        </div>
        {submissionFailureMessage && (
          <ErrorText>
            Failed to post review: {submissionFailureMessage}
          </ErrorText>
        )}
        <input type="submit" />
      </form>
    </>
  )
}

export default ReviewSection
