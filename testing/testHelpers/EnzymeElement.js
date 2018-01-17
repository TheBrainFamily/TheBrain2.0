import assert from 'assert'

export class EnzymeElement {
  constructor (wrapper, selector) {
    this.wrapper = wrapper
    this.selector = selector
  }


  async click () {
    this.wrapper.find(this.selector).first()
      .simulate('click')
      // TODO submit only if action submit
      .simulate('submit')
    await this.wrapper.refresh()
  }

  async setValue (value) {
    const input = this.wrapper.find(this.selector).first()
    input.instance().value = value
    input.simulate('change')
  }

  assertContentMatches(textToMatch) {
    const foundText = this.wrapper.find(this.selector).text()

    return assert(foundText.indexOf(textToMatch) > -1, `found ${foundText} instead of ${textToMatch}`)
  }
  _isVisible() {
    return this.wrapper.find(this.selector).length > 0
  }

  assertIsVisible() {
    assert(this._isVisible())
  }
  assertNotVisible() {
    assert(!this._isVisible())
  }
}