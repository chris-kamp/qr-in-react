import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { Heading, Container, Button } from "react-bulma-components"

const Checkin = () => {
  const [business, setBusiness] = useState()
  const [checkedIn, setCheckedIn] = useState()
  const { id } = useParams()

  useEffect(() => {
    // TODO: Catch error and redirect to homepage (with flash error?)
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        setBusiness(response.data)
        console.log(response.data)
      })
  }, [])

  const submitCheckIn = () => {
    // TODO: Post checkin to backend
    setCheckedIn(true)
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
          {checkedIn ? (
            <Button
              className="has-background-primary has-text-white is-size-5 has-text-weight-bold mb-4"
              style={{ width: "50%", minWidth: "12rem", borderRadius: "2rem" }}
              disabled
            >
              Checked In!
            </Button>
          ) : (
            <Button
              className="has-background-primary-dark has-text-white is-size-5 has-text-weight-bold mb-4"
              style={{ width: "50%", minWidth: "12rem", borderRadius: "2rem" }}
              onClick={submitCheckIn}
            >
              Check In
            </Button>
          )}
          {checkedIn && (
            <>
              <Heading className="is-size-4 mt-4">Leave a review?</Heading>
            </>
          )}
          <Button
            className="has-background-info-dark has-text-white is-size-5 has-text-weight-bold"
            style={{ width: "50%", minWidth: "12rem", borderRadius: "2rem" }}
          >
            Back to Listing
          </Button>
        </Container>
      )}
    </>
  )
}

export default Checkin
