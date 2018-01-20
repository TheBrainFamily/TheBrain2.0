export class LoginPage {
  constructor (driver) {
    this.driver = driver
  }

  get usernameFiled () {
    return this.driver.getElement('.login-form .input-username input')
  }

  get passwordFiled () {
    return this.driver.getElement('.login-form .input-password input')
  }

  get loginButton () {
    return this.driver.getElement('.login-form .login-button')
  }

  async fillUsernameFieldWith (username) {
    return this.usernameFiled.setValue(username)
  }

  async fillPasswordFieldWith (password) {
    return this.passwordFiled.setValue(password)
  }

  async login () {
    return this.loginButton.click()
  }
}
