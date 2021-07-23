import { useState, useEffect } from "react"
import { Button, Columns, Container, Heading } from "react-bulma-components"
import { stateContext } from "../../stateReducer"
import { useContext } from "react"
import { useParams } from "react-router"
import axios from "axios"
import PageHeading from "../shared/PageHeading"
import { useHistory } from "react-router-dom"
import {
  createProfileImgWidget,
  getProfileImgWidgetOpener,
} from "../../utils/CloudinaryWidgets"
import UserBio from "./UserBio"
import UserBioForm from "./UserBioForm"
import ProfileImg from "./ProfileImg"

const Profile = () => {
  const { session, dispatch } = useContext(stateContext)
  const { id } = useParams()
  const history = useHistory()
  const [user, setUser] = useState()
  const [editing, setEditing] = useState(false)
  const toggleForm = () => setEditing(!editing)

  // Fetch the user's public details
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/users/${id}/public`)
      .then((response) => {
        setUser(response.data)
      })
      // Redirect to home and display flash message error if user loading fails
      .catch(() => {
        dispatch({
          type: "pushAlert",
          alert: {
            type: "error",
            message:
              "Something went wrong. You may have tried to access a profile that doesn't exist.",
          },
        })
        history.push("/")
      })
  }, [id, dispatch, history])

  const widget = createProfileImgWidget(window, dispatch, session, setUser)
  const showWidget = getProfileImgWidgetOpener(widget, session, dispatch)

  return (
    <Container>
      <PageHeading>{user?.username}</PageHeading>
      <Columns className="is-vcentered">
        <Columns.Column>
          <figure style={{maxWidth: "400px", margin: "0 auto"}}>{user && <ProfileImg user={user} size={400} rounded />}</figure>
          {session?.user.id.toString() === id && (
            <Button
              className="button has-background-primary-dark has-text-white has-text-weight-bold mx-auto mt-2"
              style={{ borderRadius: "0.6rem", display: "block" }}
              onClick={showWidget}
            >
              Update Profile Picture
            </Button>
          )}
        </Columns.Column>
        <Columns.Column>
          <Heading className="is-size-4 has-text-centered-mobile">Bio</Heading>
          {editing ? <UserBioForm {...{toggleForm, setUser, user}} /> :
          <UserBio {...{ user, toggleForm }} />}

        </Columns.Column>
      </Columns>
      <section>
        <Heading className="is-size-4 has-text-centered mt-4">
          Recent Checkins
        </Heading>
      </section>
    </Container>
  )
}

export default Profile
