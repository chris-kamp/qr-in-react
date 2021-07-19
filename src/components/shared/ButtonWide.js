import { Button } from "react-bulma-components"
import { Link } from "react-router-dom"

const ButtonWide = ({ bgColor, children, disabled, handleClick, linkTo }) => {
  return (
    <Button
      className={`has-background-${bgColor} has-text-white is-size-5 has-text-weight-bold mb-4`}
      style={{ width: "50%", minWidth: "12rem", borderRadius: "2rem" }}
      disabled={disabled}
      onClick={handleClick}
      renderAs={linkTo && Link}
      to={linkTo}
    >
      {children}
    </Button>
  )
}

export default ButtonWide
