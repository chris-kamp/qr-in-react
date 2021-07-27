// Display a flash error
const flashError = (dispatch, message) => {
  dispatch({
    type: "pushAlert",
    alert: {
      type: "error",
      message,
    },
  })
}

// Display a flash notice
const flashNotice = (dispatch, message) => {
  dispatch({
    type: "pushAlert",
    alert: {
      type: "notice",
      message,
    },
  })
}

// Require user to be logged in to access a given page
const enforceLogin = (message, session, dispatch, history) => {
  // If user is logged in, do nothing
  if (session) return false
  // Otherwise, redirect to login page with error message
  flashError(dispatch, message)
  history.push("/login")
  return true
}

// Redirect to last visited page, or to home if no previous page set (eg. came from external site)
// or if the previous path is in "excluded" array (used to prevent infinite looping redirects)
const goBack = (backPath, history, excluded) =>
  backPath && !excluded?.includes(backPath)
    ? history.push(backPath)
    : history.push("/")

export { enforceLogin, goBack, flashError, flashNotice }
