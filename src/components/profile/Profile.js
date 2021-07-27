import { useState, useEffect } from "react"
import { Columns, Container, Heading } from "react-bulma-components"
import { stateContext } from "../../stateReducer"
import { useContext } from "react"
import { useParams } from "react-router"
import axios from "axios"
import PageHeading from "../shared/PageHeading"
import { useHistory } from "react-router-dom"
import {
  createImgWidget,
  getImgWidgetOpener,
} from "../../utils/CloudinaryWidgets"
import UserBio from "./UserBio"
import UserBioForm from "./UserBioForm"
import ProfileImg from "./ProfileImg"
import CheckinsSection from "../checkin/CheckinsSection"
import BusinessSection from "./BusinessSection"
import { flashError, flashNotice } from "../../utils/Utils"
import LoadingWidget from "../shared/LoadingWidget"
import UploadButton from "../shared/UploadButton"

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
  const [imgUpdated, setImgUpdated] = useState(false)
  const [profileImgSrc, setProfileImgSrc] = useState()
  const [showWidget, setShowWidget] = useState()
  const toggleForm = () => setEditing(!editing)

  useEffect(() => {
    if (!imgUpdated || !isCurrentUser) return
    const updateUserProfileImg = (new_img_src) => {
      setUser({ ...user, profile_img_src: new_img_src })
    }
    axios
      .patch(
        `${process.env.REACT_APP_API_ENDPOINT}/users/${session?.user.id}`,
        {
          profile_img_src: profileImgSrc,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      )
      .then((response) => {
        flashNotice(dispatch, "Profile image successfully updated")
        updateUserProfileImg(response.data.profile_img_src)
      })
      .catch((error) => {
        if (error.response?.status === 401 || error.response?.status === 404) {
          flashError(
            dispatch,
            "Image upload failed: You must be logged in to upload a profile image."
          )
        } else {
          flashError(dispatch, "Image upload failed. Please try again shortly.")
        }
      })
    setImgUpdated(false)
  }, [dispatch, profileImgSrc, session, user, imgUpdated, isCurrentUser])

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

  useEffect(() => {
    if (!isCurrentUser) return
    const updateImgSrc = (src) => {
      setProfileImgSrc(src)
      setImgUpdated(true)
    }
    const widget = createImgWidget(
      window,
      dispatch,
      session,
      updateImgSrc
    )
    setShowWidget(getImgWidgetOpener(widget, session, dispatch))
    return () => {
      widget.destroy()
    }
  }, [dispatch, session, user, isCurrentUser])

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
                <UploadButton
                  showWidget={showWidget}
                  text="Update Profile Picture"
                />
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
