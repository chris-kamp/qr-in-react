import { stateContext } from "../stateReducer"
import { useContext, useState } from "react"

const Home = () => {
  const { session, dispatch } = useContext(stateContext)
  const logOut = () => {
    dispatch({
      type: "logout",
    })
  }
  return (
    <div>
      <h1>Home</h1>
      <p>
        {session?.user
          ? `Logged in as ${session.user.username}`
          : "Not logged in"}
      </p>
      <button onClick={logOut}>Log Out</button>
    </div>
  )
}

export default Home
