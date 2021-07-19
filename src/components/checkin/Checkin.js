import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { useParams, useHistory } from "react-router-dom"
import { Heading, Container } from "react-bulma-components"
import ButtonWide from "../shared/ButtonWide"
import CheckinButton from "./CheckinButton"
import { stateContext } from "../../stateReducer"

const Checkin = () => {
  const [business, setBusiness] = useState()
  const [checkedIn, setCheckedIn] = useState()
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
    if (!session) return
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
      .then(setCheckedIn(true))
      // TODO: Handle checkin error, including redirect to login (while setting "back" path) for unauthorised error
      .catch((err) => console.log(err))
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
          <CheckinButton {...{ checkedIn, submitCheckIn }} />
          {checkedIn && (
            <>
              <Heading className="is-size-4 mt-4">Leave a review?</Heading>
            </>
          )}
          <ButtonWide linkTo={`/businesses/${id}`} bgColor="info-dark">
            Back to Listing
          </ButtonWide>
        </Container>
      )}
    </>
  )
}

export default Checkin
