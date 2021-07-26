import axios from "axios"
import { flashError, flashNotice } from "./Utils"

const createProfileImgWidget = (
  window,
  dispatch,
  session,
  updateUserProfileImg
) => {
  return window.cloudinary.createUploadWidget(
    {
      cloudName: "chriskamp",
      uploadPreset: "gp17ernf",
      folder: "qrin",
      // Max file size ~2.5mb
      maxFileSize: 2500000,
      preBatch: (cb, data) => {
        // Disallow upload of more than one file
        if (data.files.length > 1) {
          flashError(dispatch, "You can only attach one image")
          cb({ cancel: true })
        } else if (!session) {
          flashError(dispatch, "Image upload failed: You must be logged in to upload an image.")
          cb({ cancel: true })
        } else {
          cb()
        }
      },
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
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
            flashNotice(dispatch, "Profile image successfully updated")
            updateUserProfileImg(response.data.profile_img_src)
          })
          .catch((error) => {
            if (
              error.response?.status === 401 ||
              error.response?.status === 404
            ) {
              flashError(dispatch, "Image upload failed: You must be logged in to upload a profile image.")
            } else {
              flashError(dispatch, "Image upload failed. Please try again shortly.")
            }
          })
      }
    }
  )
}

const createListingImgWidget = (
  window,
  dispatch,
  session,
  setListingImgSrc
) => {
  return window.cloudinary.createUploadWidget(
    {
      cloudName: "chriskamp",
      uploadPreset: "gp17ernf",
      folder: "qrin",
      // Max file size ~2.5mb
      maxFileSize: 2500000,
      preBatch: (cb, data) => {
        // Disallow upload of more than one file
        if (data.files.length > 1) {
          flashError(dispatch, "You can only attach one image")
          cb({ cancel: true })
        } else if (!session) {
          flashError(dispatch, "Image upload failed: You must be logged in to upload an image.")
          cb({ cancel: true })
        } else {
          cb()
        }
      },
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        setListingImgSrc(result.info.public_id)
      }
    }
  )
}

const getProfileImgWidgetOpener = (widget, session, dispatch) => {
  return () => {
    if (!session) {
      flashError(dispatch, "You must be logged in to upload an image.")
    } else {
      widget.open()
    }
  }
}

export {
  createProfileImgWidget,
  createListingImgWidget,
  getProfileImgWidgetOpener,
}
