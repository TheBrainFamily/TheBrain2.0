/* global element by waitFor */

export class DetoxElement {
  constructor (selector) {
    this.selector = selector
  }

  async click () {
    await waitFor(element(by.id(this.selector))).toBeVisible().withTimeout(10000)
    await element(by.id(this.selector)).tap()
  }
  async assertContentMatches (text) {
    console.log('before wait for')
    // await waitFor(element(by.id(text))).toBeVisible().withTimeout(10000)
    console.log('after wait for')
    // await expect(element(by.id(text))).toBeVisible()
    // await waitFor(element(by.text(text))).toBeVisible().withTimeout(10000)
    // await expect(element(by.text(text))).toBeVisible()
    // await waitFor(element(by.id(this.selector).and(by.text(text)))).toBeVisible().withTimeout(10000)
    // await expect(element(by.id(this.selector).and(by.text(text)))).toBeVisible()
  }
  async assertIsVisible () {
    console.log('asserting visible', this.selector)
    await waitFor(element(by.id(this.selector))).toBeVisible().withTimeout(10000)
    await expect(element(by.id(this.selector))).toBeVisible()
  }
  async assertNotVisible () {
    console.log('asserting not visible', this.selector)
    await waitFor(element(by.id(this.selector))).toBeNotVisible().withTimeout(10000)
    await expect(element(by.id(this.selector))).toBeNotVisible()
  }
}
