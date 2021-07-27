import { Button } from "react-bulma-components"

const UploadButton = ({ showWidget, text }) => {
  return (
    <>
      {showWidget && (
        <Button
          className={`button has-background-primary-dark has-text-white has-text-weight-bold mx-auto mt-2 mb-2`}
          style={{ borderRadius: "0.6rem", display: "block" }}
          onClick={showWidget}
        >
          {text}
        </Button>
      )}
    </>
  )
}

export default UploadButton
