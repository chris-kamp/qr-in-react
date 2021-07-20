import { Message, Button } from "react-bulma-components"
import { useContext } from "react"
import { stateContext } from "../../stateReducer"

const Alert = ({id, message, type}) => {
  const { dispatch } = useContext(stateContext)

  const removeAlert = () => dispatch({
    type: "removeAlert",
    id
  })

  return (
    <Message color={type === "error" ? "danger" : "info"} className="my-1">
      <Message.Header>
        {message}
        <Button remove onClick={removeAlert} />
      </Message.Header>
    </Message>
  )
}

export default Alert
