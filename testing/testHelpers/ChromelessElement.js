import assert from 'assert'

export class ChromelessElement {
  constructor (wrapper, selector) {
    this.wrapper = wrapper
    this.selector = selector
  }

  async click () {
    await this.wrapper.click(this.selector)
  }

  async setValue (value) {
    await this.wrapper.type(value, this.selector)
  }

  async assertIsVisible () {
    const value = await this.wrapper.exists(this.selector)
    assert(value, `${this.selector} should be visible`)
  }

  async assertNotVisible () {
    console.log('not visible?')
    await this.wrapper.wait(1000) // TODO we should add waitFor function here, loop for a second checking if it's true, stop looping and do the initial check
    const value = await this.wrapper.exists(this.selector)
    console.log('is not visible?', value)
    assert(!value, `${this.selector} should be not visible`)
  }
}
