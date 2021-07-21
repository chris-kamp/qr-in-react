import { Button } from "react-bulma-components"

const SubmitButton = ({ form, value }) => {
  return (
    <Button
      renderAs="input"
      type="submit"
      {...{ form, value }}
      className="button has-background-primary-dark has-text-white has-text-weight-bold mx-1"
      style={{ borderRadius: "0.6rem" }}
    />
  )
}

export default SubmitButton
