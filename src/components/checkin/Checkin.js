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
import { enforceLogin, flashError, goBack } from "../../utils/Utils"
import LoadingWidget from "../shared/LoadingWidget"

const Checkin = () => {
  const [business, setBusiness] = useState()
  const [checkinId, setCheckinId] = useState()
  const [loaded, setLoaded] = useState(false)
  const [checkinFailureMessage, setCheckinFailureMessage] = useState()
  const { id } = useParams()
  const history = useHistory()
  const { session, dispatch, backPath } = useContext(stateContext)

  useEffect(() => {
    // If not logged in, redirect to login page with flash error message, and return to prevent making unnecessary requests
    if (
      enforceLogin(
        "You must be logged in to check in",
        session,
        dispatch,
        history
      )
    ) return

    // Get details of the business to which the checkin relates
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        // Prevent user checking in at their own business - redirect back to previous page (or home, if no valid backPath context exists)
        if (response.data.user_id === session?.user.id) {
          flashError(dispatch, "You cannot check in at your own business.")
          goBack(backPath, history)
          return
        }
        // Set business details and "loaded" status in state
        setBusiness(response.data)
        setLoaded(true)
      })
      // Redirect to home and display flash message error if business loading fails
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong. You may have tried to access a checkin page that doesn't exist."
        )
        history.push("/")
      })
  }, [dispatch, history, id, session, backPath])

  // Callback function to submit checkin
  const submitCheckIn = () => {
    // If not logged in, redirect to login page with flash error message, then return to prevent further action
    if (
      enforceLogin(
        "You must be logged in to check in",
        session,
        dispatch,
        history
      )
    ) return
    // Post checkin to backend API
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
        // Get the id of the checkin to associate with a review (if user posts one)
        setCheckinId(response.data.id)
        // Remove failure message on successful checkin
        setCheckinFailureMessage(null)
      })
      .catch((err) => {
        // If unauthorised, redirect user to login page
        if (err.response?.status === 401) {
          history.push("/login")
          flashError(dispatch, "You must be logged in to check in")
        } else if (err.response?.status === 403) {
          goBack(backPath, history)
          flashError(dispatch, "You cannot check in at your own business")
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
    {/* Display loading widget until all requests finish and "loaded" state is set to true */}
      {loaded ? (
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
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}
export default Checkin
