const InputLabel = ({ htmlFor, text, isFirst }) => {
  return (
    <label
      {...{ htmlFor }}
      className={`has-text-weight-bold is-size-5 ${!isFirst && "mt-4"}`}
    >
      {text}
    </label>
  )
}

export default InputLabel
