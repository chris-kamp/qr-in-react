import { stateContext } from "../stateReducer"
import { useContext } from "react"

const Home = () => {
  const { session } = useContext(stateContext)

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default Home
