import Alert from "./Alert"
import { useContext } from "react"
import { stateContext } from "../../stateReducer"

const Alerts = () => {
  const { alerts } = useContext(stateContext)
  return (
    <>
      {alerts.map(alert => (
        <Alert {...alert} key={alert.id} />
      ))}
    </>
  )
}

export default Alerts
