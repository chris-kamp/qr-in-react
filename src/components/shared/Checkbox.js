const Checkbox = ({ register, name, labelText, validator, type, form, focus }) => {
  return (
    <label className="checkbox">
      <input type="checkbox" className="mr-1"
        {...{ type, form }}
        {...register(name, validator)}
        autoFocus={focus}
      ></input>
      {labelText}
    </label>
  )
}

export default Checkbox
