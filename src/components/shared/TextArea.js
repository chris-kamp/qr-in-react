const TextArea = ({register, name, validator, placeholder}) => {
  return (
    <textarea
    className="textarea is-medium has-background-grey-lighter"
    style={{ borderRadius: "1rem" }}
    {...register(name, validator)}
    placeholder={placeholder}
  />
  )
}

export default TextArea
