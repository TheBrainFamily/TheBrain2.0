export class LandingPage {
  constructor (driver) {
    this.driver = driver
  }

  get skipTutorialButton () {
    return this.driver.getElement('.skip-tutorial-button')
  }

  get introductionVideo () {
    return this.driver.getElement('.youTube-player')
  }

  async skipTutorial () {
    await this.skipTutorialButton.click()
  }
}
