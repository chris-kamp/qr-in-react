const Input = ({register, name, validator, placeholder, type, form, focus}) => {
  return (
    <input
      className="input is-medium has-background-grey-lighter"
      style={{ borderRadius: "1rem", width: "50%", minWidth: "20rem" }}
      placeholder={placeholder}
      {...{type, form}}
      {...register(name, validator)}
      autoFocus={focus}
    />
  )
}

export default Input
