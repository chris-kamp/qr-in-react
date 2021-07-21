import { Heading } from "react-bulma-components"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory } from "react-router"
import { stateContext } from "../../stateReducer"
import axios from "axios"
import { reviewContentValidator } from "../../utils/Validators"
import { ErrorText } from "../../styled-components/FormStyledComponents"
import TextArea from "../shared/TextArea"
import { Rating } from "@material-ui/lab"

const ReviewSection = ({ id, checkinId }) => {
  const [submissionFailureMessage, setSubmissionFailureMessage] = useState()
  const [rating, setRating] = useState(0)
  const history = useHistory()
  const { session } = useContext(stateContext)
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
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/reviews`,
        { ...data, checkin_id: checkinId },
        {
          headers: { Authorization: `Bearer ${session.token}` },
        }
      )
      .then(() => {
        // TODO: Display review posting success message
        // Remove failure message on successful submission
        setSubmissionFailureMessage(null)
        // Redirect to business listing
        history.push(`/businesses/${id}`)
      })
      .catch((error) => {
        // TODO: Handle specific errors, including redirect to login (while setting "back" path) for unauthorised error
        // Display error messages - handles general errors not otherwise dealt with

        setSubmissionFailureMessage(
          "Something went wrong. Please try again shortly."
        )
      })
  }

  return (
    <>
      <Heading className="is-size-4 mt-4">Leave a review?</Heading>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "80%" }}>
        <div style={{ width: "100%" }}>
          {
            <Rating
              {...register("rating", { required: true })}
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue)
              }}
            />
          }
          {errors.rating && <ErrorText>Rating is required</ErrorText>}
        </div>
        <div style={{ width: "100%" }}>
          <TextArea
            {...{
              register,
              name: "content",
              validator: reviewContentValidator,
              placeholder: "Comments (optional)",
            }}
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
        <input
          type="submit"
          className="button has-background-primary-dark has-text-white has-text-weight-bold mt-2 is-pulled-right"
          value="Post"
          style={{ borderRadius: "0.6rem" }}
        />
      </form>
    </>
  )
}

export default ReviewSection
