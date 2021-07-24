import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { useParams, useHistory } from "react-router-dom"
import { Heading } from "react-bulma-components"
import ButtonWide from "../shared/ButtonWide"
import CheckinButton from "./CheckinButton"
import { stateContext } from "../../stateReducer"
import ReviewSection from "./ReviewSection"
import ErrorText from "../shared/ErrorText"
import FormContainer from "../shared/FormContainer"
import { enforceLogin } from "../../utils/Utils"


const Checkin = () => {
  const [business, setBusiness] = useState()
  const [checkinId, setCheckinId] = useState()
  const [checkinFailureMessage, setCheckinFailureMessage] = useState()
  const { id } = useParams()
  const history = useHistory()
  const { session, dispatch } = useContext(stateContext)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        setBusiness(response.data)
      })
      .then(() => {
        // If not logged in, redirect to login page with flash error message
        enforceLogin(
          "You must be logged in to check in",
          session,
          dispatch,
          history
        )
      })
      // Redirect to home and display flash message error if business loading fails
      .catch(() => {
        dispatch({
          type: "pushAlert",
          alert: {
            type: "error",
            message:
              "Something went wrong. You may have tried to access a checkin page that doesn't exist.",
          },
        })
        history.push("/")
      })
  }, [dispatch, history, id, session])

  const submitCheckIn = () => {
    // If not logged in, redirect to login page with flash error message, then return to prevent further action
    if (
      enforceLogin(
        "You must be logged in to check in",
        session,
        dispatch,
        history
      )
    )
      return
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
        // If unauthorised, redirect user to login page
        // TODO: Handle case where user might be logged in but unauthorised
        if (err.response?.status === 401) {
          history.push("/login")
          dispatch({
            type: "pushAlert",
            alert: {
              type: "error",
              message: "You must be logged in to check in",
            },
          })
        } else {
          // Display error messages - handles general errors not otherwise dealt with
          setCheckinFailureMessage(
            "Something went wrong. Please try again shortly."
          )
        }
      })
  }

  return (
    <>
      {business && (
        <FormContainer>
          <Heading className="has-text-centered mt-5">
            Check in at
            <br />
            {business.name}
          </Heading>
          <CheckinButton {...{ checkinId, submitCheckIn }} />
          {checkinFailureMessage && (
            <ErrorText>Checkin failed: {checkinFailureMessage}</ErrorText>
          )}
          {checkinId && <ReviewSection {...{ id, checkinId, business }} />}
          <ButtonWide
            linkTo={`/businesses/${id}`}
            bgColor="info-dark"
            addClasses="mt-4"
          >
            Back to Listing
          </ButtonWide>
        </FormContainer>
      )}
    </>
  )
}
export default Checkin
