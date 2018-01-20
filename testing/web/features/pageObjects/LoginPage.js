export class LoginPage {
  constructor (driver) {
    this.driver = driver
  }

  get usernameFiled () {
    return this.driver.getElement(':nth-child(3) input')
  }

  get passwordFiled () {
    return this.driver.getElement(':nth-child(4) input')
  }

  get loginButton () {
    return this.driver.getElement('.login-button')
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
