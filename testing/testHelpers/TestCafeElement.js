const {Selector, t} = require('testcafe')

class TestCafeElement {
  constructor(selector) {
    this.selector = selector
  }

  async click() {
    await t.click(Selector(this.selector))
  }

  async setValue (value) {
    await t.typeText(Selector(this.selector), value);
  }

  async assertIsVisible() {
    await t.expect(Selector(this.selector).exists).ok(`${this.selector} should be visible`)
  }

  async assertNotVisible() {
    await t.expect(Selector(this.selector).exists).ok(`${this.selector} should be not visible`)
  }
}

exports.TestCafeElement = TestCafeElement
