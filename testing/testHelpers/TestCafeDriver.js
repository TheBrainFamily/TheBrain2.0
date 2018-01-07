// import { TestCafeElement } from './TestCafeElement'
const TestCafeElement = require('./TestCafeElement').TestCafeElement

class TestCafeDriver {
  getElement (selector) {
    return new TestCafeElement(selector)
  }

  saveHtml () {
    // noop
  }
}

exports.TestCafeDriver = TestCafeDriver
