import { useState, useEffect } from "react"
import { Image } from "cloudinary-react"
import { Button } from "react-bulma-components"
import { stateContext } from "../stateReducer"
import { useContext } from "react"
import { useParams } from "react-router"
import axios from "axios"

const Profile = () => {
  const { session, dispatch } = useContext(stateContext)
  const { id } = useParams();

  const [profileImgSrc, setProfileImgSrc] = useState()

  // Fetch the user's profile image
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/users/${id}/public`
      )
      .then((response) => {
        setProfileImgSrc(response.data.profile_img_src)
      })
      .catch((err) => {
        dispatch({
          type: "pushAlert",
          alert: {
            type: "error",
            message:
              "Something went wrong when attempting to load profile image",
          },
        })
      })
  }, [])

  let widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "chriskamp",
      uploadPreset: "gp17ernf",
      folder: "qrin",
      // Max file size ~2.5mb
      maxFileSize: 2500000,
      preBatch: (cb, data) => {
        // Disallow upload of more than one file
        if (data.files.length > 1) {
          dispatch({
            type: "pushAlert",
            alert: {
              type: "error",
              message: "You can only attach one image",
            },
          })
          cb({ cancel: true })
        } else if (!session) {
          dispatch({
            type: "pushAlert",
            alert: {
              message:
                "Image upload failed: You must be logged in to upload a profile image.",
              type: "error",
            },
          })
          cb({ cancel: true })
        } else {
          cb()
        }
      },
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info.public_id)
        axios
          .patch(
            `${process.env.REACT_APP_API_ENDPOINT}/users/${session?.user.id}`,
            {
              profile_img_src: result.info.public_id,
            },
            {
              headers: {
                Authorization: `Bearer ${session?.token}`,
              },
            }
          )
          .then((response) => {
            dispatch({
              type: "pushAlert",
              alert: {
                message: "Profile image successfully updated",
                type: "notice",
              },
            })
            setProfileImgSrc(response.data.profile_img_src)
          })
          .catch((error) => {
            if (
              error.response.status === 401 ||
              error.response.status === 404
            ) {
              dispatch({
                type: "pushAlert",
                alert: {
                  message:
                    "Image upload failed: You must be logged in to upload a profile image.",
                  type: "error",
                },
              })
            } else {
              dispatch({
                type: "pushAlert",
                alert: {
                  message: "Image upload failed. Please try again shortly.",
                  type: "error",
                },
              })
            }
          })
      }
    }
  )

  const showWidget = () => {
    if (!session) {
      dispatch({
        type: "pushAlert",
        alert: {
          message: "You must be logged in to upload a profile image.",
          type: "error",
        },
      })
    } else {
      widget.open()
    }
  }
  return (
    <div>
      <h1>Profile</h1>
      <Button
        className="button has-background-primary-dark has-text-white has-text-weight-bold mx-1"
        style={{ borderRadius: "0.6rem" }}
        onClick={showWidget}
      >
        Upload
      </Button>
      {profileImgSrc ? (
        <Image
          cloudName="chriskamp"
          publicId={profileImgSrc}
          width="300"
          crop="scale"
        />
      ) : (
        <p>Image placeholder</p>
      )}
    </div>
  )
}

export default Profile
