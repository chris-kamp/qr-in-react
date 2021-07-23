import { Button } from "react-bulma-components"

const CloseFormButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="button has-background-danger has-text-white has-text-weight-bold mx-1"
      style={{ borderRadius: "0.6rem" }}
    >
      Cancel
    </Button>
  )
}

export default CloseFormButton
