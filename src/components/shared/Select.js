const Select = ({
  register,
  name,
  options,
  optionKeyField,
  optionLabelField,
  validator,
  placeholder,
  type,
  form,
  focus,
}) => {
  return (
    <select
      className="select is-medium is-rounded has-background-grey-lighter"
      style={{ borderRadius: "1rem", width: "50%", minWidth: "20rem" }}
      placeholder={placeholder}
      {...{ type, form }}
      {...register(name, validator)}
      autoFocus={focus}
    >
      {options.map((option) => (
        <option key={option[optionKeyField]} value={option[optionKeyField]}>
          {option[optionLabelField]}
        </option>
      ))}
    </select>
  )
}

export default Select
