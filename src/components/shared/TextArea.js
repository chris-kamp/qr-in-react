const TextArea = ({
  register,
  name,
  validator,
  placeholder,
  form,
  defaultValue,
}) => {
  return (
    <textarea
      className="textarea is-medium has-background-grey-lighter"
      style={{ borderRadius: "1rem" }}
      {...register(name, validator)}
      placeholder={placeholder}
      form={form ? form : undefined}
      defaultValue={defaultValue ? defaultValue : undefined}
    />
  )
}

export default TextArea
