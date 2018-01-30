export class VotingInstruction {
  constructor (driver) {
    this.driver = driver
  }

  get dismissTutorialButton () {
    return this.driver.getElement('dismiss-tutorial')
  }

  async dismissTutorial () {
    await this.dismissTutorialButton.click()
  }
}
