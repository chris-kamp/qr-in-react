import { stateContext } from "../stateReducer"
import { useContext } from "react"

const Home = () => {
  const { session } = useContext(stateContext)

  return (
    <div>
      <h1>Home</h1>
      <p>
        {session?.user
          ? `Logged in as ${session.user.username}`
          : "Not logged in"}
      </p>
    </div>
  )
}

export default Home
