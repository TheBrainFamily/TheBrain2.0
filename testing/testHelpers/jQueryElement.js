import $ from 'jquery'
import assert from 'assert'

export class jQueryElement {
  constructor (selector) {
    this.selector = selector
  }
  click () {
    $(`${this.selector}`).click()
  }
  _isVisible () {
    return $(`${this.selector}`).length > 0
  }
  assertIsVisible () {
    assert(this._isVisible())
  }
  assertNotVisible () {
    assert(!this._isVisible())
  }
}
