import { Button } from "react-bulma-components"
import { Link } from "react-router-dom"
const CancelButton = ({ to }) => {
  return (
    <Button
      renderAs={Link}
      to={to ? to : "/"}
      className="button has-background-danger has-text-white has-text-weight-bold mx-1"
      style={{ borderRadius: "0.6rem" }}
    >
      Cancel
    </Button>
  )
}

export default CancelButton
