export class CourseSelector {
  constructor (driver) {
    this.driver = driver
  }

  get chooseBiologyButton () {
    return this.driver.getElement('Biology-courseSelector')
  }

  async chooseBiology () {
    await this.chooseBiologyButton.click()
  }

  assertIsVisible () {
    return this.chooseBiologyButton.assertIsVisible()
  }
}
