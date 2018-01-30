export class HardcoreWarningView {
  constructor (driver) {
    this.driver = driver
  }

  get showHardcoreQuestionsButton () {
    return this.driver.getElement('show_hardcore_questions')
  }

  async showHardcoreQuestions () {
    await this.showHardcoreQuestionsButton.click()
  }
}
