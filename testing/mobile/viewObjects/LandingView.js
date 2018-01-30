export class LandingView {
  constructor (driver) {
    this.driver = driver
  }

  get skipTutorialButton () {
    return this.driver.getElement('skip_intro_button')
  }

  get introductionVideo () {
    return this.driver.getElement('intro_video')
  }

  async skipTutorial () {
    await this.skipTutorialButton.click()
  }

  assertIsVisible () {
    return this.skipTutorialButton.assertIsVisible()
  }
}
