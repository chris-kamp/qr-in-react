// Email must be valid, and not more than 64 characters
const emailValidator = { required: true, maxLength: 64, pattern: /^[^@]+@[^@]+\.[^@]+$/ }
// Username must be between 4 and 20 characters
const usernameValidator = {required: true, maxLength: 20, minLength: 4}
// Password must be at least 8 characters and contain uppercase letter, lowercase letter and number
const passwordValidator = { required: true, minLength: 8, pattern: /^.*(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/ }

export { emailValidator, usernameValidator, passwordValidator }