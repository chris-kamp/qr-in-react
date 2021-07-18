const emailValidator = { required: true, maxLength: 64, pattern: /^[^@]+@[^@]+\.[^@]+$/ }
const usernameValidator = {required: true, maxLength: 20, minLength: 4}
const passwordValidator = { required: true, minLength: 6 }

export { emailValidator, usernameValidator, passwordValidator }