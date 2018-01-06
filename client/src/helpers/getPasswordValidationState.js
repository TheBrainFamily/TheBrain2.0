export default function getPasswordValidationState ({ oldPassword, newPassword, newPasswordConfirmation }) {
  let state = { oldPasswordError: '' }
  if (!oldPassword.length) {
    return { oldPasswordError: 'Password cannot be empty', isValid: false }
  }
  if (newPassword.length !== newPasswordConfirmation.length) {
    let confirmationError = ''
    if (newPasswordConfirmation.length > newPassword.length) {
      confirmationError = 'Password confirmation is too long'
    }
    return { ...state, confirmationError, isValid: false }
  }
  if (newPassword !== newPasswordConfirmation) {
    return { ...state, confirmationError: 'Passwords don\'t match', isValid: false }
  }
  if (newPasswordConfirmation.length > 3) {
    return { ...state, isValid: true }
  }
  return state
}
