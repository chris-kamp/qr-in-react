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
  // Details of the user to which the profile relates
  const [user, setUser] = useState()
  const [editing, setEditing] = useState(false)
  // Is this the profile of the user currently logged in?
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  // ID of the current user's business (if any, and if this is the user's own profile)
  const [businessId, setBusinessId] = useState()
  const [loadedPublic, setLoadedPublic] = useState(false)
  const [loadedPrivate, setLoadedPrivate] = useState(false)
  // Tracks whether a new profile image has been uploaded, to update display
  const [imgUpdated, setImgUpdated] = useState(false)
  // Cloudinary public ID of the image to display as user's profile image
  const [profileImgSrc, setProfileImgSrc] = useState()
  // Function to open image upload widget
  const [showWidget, setShowWidget] = useState()
  // Toggle whether the edit bio form is displayed
  const toggleForm = () => setEditing(!editing)

  // When the user uploads a new profile image, send it to the backend server and update the user resource
  useEffect(() => {
    // Do nothing if image has not been updated or this is not the logged in user's own profile
    if (!imgUpdated || !isCurrentUser) return
    // Function to update the "user" state with new profile image source
    const updateUserProfileImg = (new_img_src) => {
      setUser({ ...user, profile_img_src: new_img_src })
    }
    // Update user resource on the backend API with the new image source
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
      // Notify success, then update displayed profile image source
      .then((response) => {
        flashNotice(dispatch, "Profile image successfully updated")
        updateUserProfileImg(response.data.profile_img_src)
      })
      // Catch and notify of errors. Handles unauthorised, 404, and other general errors
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
    // Reset "imgUpdated" to false so this request will not be repeated until a new image is uploaded
    setImgUpdated(false)
  }, [dispatch, profileImgSrc, session, user, imgUpdated, isCurrentUser])

  // If accessing the profile of the currently logged in user, fetch their business id
  useEffect(() => {
    // Check if profile belongs to the current logged in user, and set state accordingly
    const currentUser = session?.user.id.toString() === id
    setIsCurrentUser(currentUser)
    // If profile belongs to logged in user, fetch non-public user account details
    if (currentUser) {
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })
        // Set the businessId state to the id of the user's business (if any)
        .then((response) => {
          setBusinessId(response.data.business?.id)
          // Mark private user details as loaded
          setLoadedPrivate(true)
        })
        // Catch and display error if business details fail to load
        .catch((error) => {
          flashError(
            dispatch,
            "Something went wrong while trying to load your business details. Please try again shortly"
          )
        })
    } else {
      // If private user details not required, mark as loaded (so loading widget will stop displaying)
      setLoadedPrivate(true)
    }
  }, [id, session, dispatch])

  // Fetch the user's public details
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/users/${id}/public`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
      // Set user state with response data, and mark public details as loaded
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

  // If this is the current user's profile, attach cloudinary upload widget to window object to allow uploading new profile img
  useEffect(() => {
    // Do nothing if this is not the current user's profile
    if (!isCurrentUser) return
    // Function to pass to cloudinary widget. Will set profile image source state and set imageUpdated to true when new image is uploaded.
    const updateImgSrc = (src) => {
      setProfileImgSrc(src)
      setImgUpdated(true)
    }
    
    // Create cloudinary widget and attach it to window object, passing in updateImgSrc callback
    const widget = createImgWidget(
      window,
      dispatch,
      session,
      updateImgSrc
    )

    // Get a callback function to open cloudinary widget, and store it in state
    setShowWidget(getImgWidgetOpener(widget, session, dispatch))
    // On unmount, remove the cloudinary widget from memory
    return () => {
      widget.destroy()
    }
  }, [dispatch, session, user, isCurrentUser])

  return (
    <>
    {/* Display page content only when all requests finish */}
      {loadedPublic && loadedPrivate ? (
        <Container>
          <PageHeading>{user?.username}</PageHeading>
          <Columns className="is-vcentered">
            <Columns.Column>
              <figure style={{ maxWidth: "400px", margin: "0 auto" }}>
                {user && <ProfileImg user={user} size={400} rounded />}
              </figure>
              {/* Display upload button only on current logged in user's profile */}
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
              {/* Display user's bio, or a form to edit the bio, depending on whether "editing" state is toggled to true */}
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
      {/* ^Display loading widget until requests finish */}
    </>
  )
}

export default Profile
