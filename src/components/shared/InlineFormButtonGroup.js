import CloseFormButton from "./CloseFormButton"
import SubmitButton from "./SubmitButton"

const InlineFormButtonGroup = ({ form, toggleForm, submitValue }) => {
  return (
    <div className="mt-5">
      <CloseFormButton onClick={toggleForm} />
      <SubmitButton {...{ form }} value={submitValue} />
    </div>
  )
}

export default InlineFormButtonGroup
