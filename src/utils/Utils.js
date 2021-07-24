const enforceLogin = (message, session, dispatch, history) => {
  // If user is logged in, do nothing
  if (session) return false
  // Otherwise, redirect to login page with error message
  dispatch({
    type: "pushAlert",
    alert: {
      message,
      type: "error",
    },
  })
  history.push("/login")
  return true
}

// Redirect to last visited page, or to home if no previous page set (eg. came from external site)
// or if the previous path is in "excluded" array (used to prevent infinite looping redirects)
const goBack = (backPath, history, excluded) =>
  backPath && !(excluded?.includes(backPath)) ? history.push(backPath) : history.push("/")

export { enforceLogin, goBack }
