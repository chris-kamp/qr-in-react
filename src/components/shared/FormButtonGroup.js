import CancelButton from "./CancelButton"
import SubmitButton from "./SubmitButton"

const FormButtonGroup = ({ form, submitValue, cancelTo }) => {
  return (
    <div className="mt-5">
      <CancelButton to={cancelTo} />
      <SubmitButton {...{ form }} value={submitValue} />
    </div>
  )
}

export default FormButtonGroup
