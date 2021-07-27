import { flashError } from "./Utils"

const createProfileImgWidget = (
  window,
  dispatch,
  session,
  updateImgSrc
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
        updateImgSrc(result.info.public_id)
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
      return widget.open
    }
  }
}

export {
  createProfileImgWidget,
  createListingImgWidget,
  getProfileImgWidgetOpener,
}
