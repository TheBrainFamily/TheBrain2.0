export class LoginPage {
  constructor (driver) {
    this.driver = driver
  }

  get usernameField () {
    return this.driver.getElement('.login-form .input-username input')
  }

  get passwordField () {
    return this.driver.getElement('.login-form .input-password input')
  }

  get loginButton () {
    return this.driver.getElement('.login-form .login-button')
  }

  async fillUsernameFieldWith (username) {
    return this.usernameField.setValue(username)
  }

  async fillPasswordFieldWith (password) {
    return this.passwordField.setValue(password)
  }

  async login () {
    return this.loginButton.click()
  }
}
