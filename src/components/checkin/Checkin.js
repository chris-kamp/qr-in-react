import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { useParams, useHistory } from "react-router-dom"
import { Heading, Container } from "react-bulma-components"
import ButtonWide from "../shared/ButtonWide"
import CheckinButton from "./CheckinButton"
import { stateContext } from "../../stateReducer"
import ReviewSection from "./ReviewSection"
import { ErrorText } from "../../styled-components/FormStyledComponents"

const Checkin = () => {
  const [business, setBusiness] = useState()
  const [checkinId, setCheckinId] = useState()
  const [checkinFailureMessage, setCheckinFailureMessage] = useState()
  const { id } = useParams()
  const history = useHistory()
  const { session } = useContext(stateContext)
  useEffect(() => {
    // TODO: Catch error and redirect to homepage (with flash error?)
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        setBusiness(response.data)
      })
      // Redirect to home if business loading fails
      // TODO: Display error as flash message or modal
      .catch(() => {
        history.push("/")
      })
  }, [])

  const submitCheckIn = () => {
    // TODO: If not logged in, should redirect to login (while setting "back" path)
    if (!session) {
      history.push("/login")
      return
    }
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/checkins`,
        {
          business_id: id,
          user_id: session && session.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      )
      .then((response) => {
        setCheckinId(response.data.id)
        // Remove failure message on successful checkin
        setCheckinFailureMessage(null)
      })
      .catch((err) => {
        // TODO: Handle specific errors, including redirect to login (while setting "back" path) for unauthorised error
        // Display error messages - handles general errors not otherwise dealt with
        setCheckinFailureMessage(
          "Something went wrong. Please try again shortly."
        )
      })
  }

  return (
    <>
      {business && (
        <Container className="is-flex is-flex-direction-column is-align-items-center">
          <Heading className="has-text-centered">
            Check in at
            <br />
            {business.name}
          </Heading>
          <CheckinButton {...{ checkinId, submitCheckIn }} />
          {checkinFailureMessage && (
            <ErrorText>
              Checkin failed: {checkinFailureMessage}
            </ErrorText>
          )}
          {checkinId && <ReviewSection {...{ id, checkinId }} />}
          <ButtonWide linkTo={`/businesses/${id}`} bgColor="info-dark" addClasses="mt-4">
            Back to Listing
          </ButtonWide>
        </Container>
      )}
    </>
  )
}

export default Checkin
