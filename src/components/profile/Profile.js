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
import CheckinsSection from "../checkin/CheckinsSection"
import BusinessSection from "./BusinessSection"
import { flashError } from "../../utils/Utils"
import LoadingWidget from "../shared/LoadingWidget"

const Profile = () => {
  const { session, dispatch } = useContext(stateContext)
  const { id } = useParams()
  const history = useHistory()
  const [user, setUser] = useState()
  const [editing, setEditing] = useState(false)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [businessId, setBusinessId] = useState()
  const [loadedPublic, setLoadedPublic] = useState(false)
  const [loadedPrivate, setLoadedPrivate] = useState(false)
  const toggleForm = () => setEditing(!editing)
  const updateUserProfileImg = (new_img_src) => {
    setUser({ ...user, profile_img_src: new_img_src })
  }

  // If accessing the profile of the currently logged in user, fetch their business id
  useEffect(() => {
    const currentUser = session?.user.id.toString() === id
    setIsCurrentUser(currentUser)
    if (currentUser) {
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })
        .then((response) => {
          setBusinessId(response.data.business?.id)
          setLoadedPrivate(true)
        })
        .catch((error) => {
          flashError(
            dispatch,
            "Something went wrong while trying to load your business details. Please try again shortly"
          )
        })
    } else {
      setLoadedPrivate(true)
    }
  }, [id, session, dispatch])

  //

  // Fetch the user's public details
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/users/${id}/public`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
      .then((response) => {
        setUser(response.data)
        setLoadedPublic(true)
      })
      // Redirect to home and display flash message error if user loading fails
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong. You may have tried to access a profile that doesn't exist."
        )
        history.push("/")
      })
  }, [id, dispatch, history, isCurrentUser, session])

  const widget = createProfileImgWidget(
    window,
    dispatch,
    session,
    updateUserProfileImg
  )
  const showWidget = getProfileImgWidgetOpener(widget, session, dispatch)

  return (
    <>
      {loadedPublic && loadedPrivate ? (
        <Container>
          <PageHeading>{user?.username}</PageHeading>
          <Columns className="is-vcentered">
            <Columns.Column>
              <figure style={{ maxWidth: "400px", margin: "0 auto" }}>
                {user && <ProfileImg user={user} size={400} rounded />}
              </figure>
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
              <Heading className="is-size-4 has-text-centered-mobile">
                Bio
              </Heading>
              {editing ? (
                <UserBioForm {...{ toggleForm, setUser, user }} />
              ) : (
                <UserBio {...{ user, toggleForm, isCurrentUser }} />
              )}
            </Columns.Column>
          </Columns>
          {isCurrentUser && <BusinessSection {...{ businessId }} />}
          <section>
            <Heading className="is-size-4 has-text-centered mt-4">
              Recent Checkins
            </Heading>
            {user?.checkins ? (
              <CheckinsSection checkins={user.checkins} />
            ) : (
              <p className="has-text-centered">
                This user hasn't checked in anywhere yet
              </p>
            )}
          </section>
        </Container>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default Profile
