import axios from "axios"

const createProfileImgWidget = (window, dispatch, session, updateUserProfileImg) => {
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
                "Image upload failed: You must be logged in to upload an image.",
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
            updateUserProfileImg(response.data.profile_img_src)
          })
          .catch((error) => {
            if (
              error.response?.status === 401 ||
              error.response?.status === 404
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
}

const createListingImgWidget = (window, dispatch, session, setListingImgSrc) => {
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
                "Image upload failed: You must be logged in to upload an image.",
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
        setListingImgSrc(result.info.public_id)
      }
    }
  )
}

const getProfileImgWidgetOpener = (widget, session, dispatch) => {
  return () => {
    if (!session) {
      dispatch({
        type: "pushAlert",
        alert: {
          message: "You must be logged in to upload an image.",
          type: "error",
        },
      })
    } else {
      widget.open()
    }
  }
}

export { createProfileImgWidget, createListingImgWidget, getProfileImgWidgetOpener }
