import { flashError } from "./Utils"

// Given a callback function "updateImgSrc" and access to the window, session and dispatch function,
// create a cloudinary image upload widget and attach it to the window
const createImgWidget = (
  window,
  dispatch,
  session,
  updateImgSrc
) => {
  // Create and return the widget with given options
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
        // Disallow upload if user not logged in 
        } else if (!session) {
          flashError(dispatch, "Image upload failed: You must be logged in to upload an image.")
          cb({ cancel: true })
        } else {
          cb()
        }
      },
    },
    (error, result) => {
      // If upload succeeds, call updateImgSrc passing in the public id for the newly uploaded image
      if (!error && result && result.event === "success") {
        updateImgSrc(result.info.public_id)
      }
    }
  )
}

// Checks if user is logged in. If so, returns a callback function to open the cloudinary image upload widget.
const getImgWidgetOpener = (widget, session, dispatch) => {
  return () => {
    if (!session) {
      flashError(dispatch, "You must be logged in to upload an image.")
    } else {
      return widget.open
    }
  }
}

export {
  createImgWidget,
  getImgWidgetOpener,
}
