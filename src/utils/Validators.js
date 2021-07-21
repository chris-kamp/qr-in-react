// Email must be valid, and not more than 64 characters
const emailValidator = { required: true, maxLength: 64, pattern: /^[^@]+@[^@]+\.[^@]+$/ }
// Username must be between 4 and 20 characters
const usernameValidator = {required: true, maxLength: 20, minLength: 4}
// Password must be at least 8 characters and contain uppercase letter, lowercase letter and number
const passwordValidator = { required: true, minLength: 8, pattern: /^.*(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/ }
// When logging in (not signing up), only validate that password is present
const loginPasswordValidator = { required: true }
// Review content must not exceed 200 characters in length
// TODO: Check that this length fits well in the UI
const reviewContentValidator = { maxLength: 200 }

export { emailValidator, usernameValidator, passwordValidator, loginPasswordValidator, reviewContentValidator }