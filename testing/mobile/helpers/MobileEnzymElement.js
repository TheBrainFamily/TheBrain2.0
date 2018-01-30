import assert from 'assert'

export class MobileEnzymeElement {
  constructor (wrapper, selector) {
    this.wrapper = wrapper
    this.selector = {testID: selector}
  }

  async click () {
    this.wrapper.find(this.selector).first()
      .props().onPress()
    await this.wrapper.refresh()
  }

  async setValue (value) {
    const input = this.wrapper.find(this.selector).first()
    input.instance().value = value
    input.simulate('change')
  }

  assertContentMatches (textToMatch) {
    const foundText = this.wrapper.find(this.selector).first().text()

    return assert(foundText.indexOf(textToMatch) > -1, `found ${foundText} instead of ${textToMatch}`)
  }

  _isVisible () {
    return this.wrapper.find(this.selector).length > 0
  }

  assertIsVisible () {
    assert(this._isVisible())
  }
  assertNotVisible () {
    assert(!this._isVisible())
  }
}
