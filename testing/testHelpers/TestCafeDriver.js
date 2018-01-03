// import { TestCafeElement } from './TestCafeElement'
const TestCafeElement = require('./TestCafeElement').TestCafeElement
class TestCafeDriver {
  getElement (selector) {
    return new TestCafeElement(selector)
  }
}

exports.TestCafeDriver = TestCafeDriver
