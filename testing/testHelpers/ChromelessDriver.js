import { ChromelessElement } from './ChromelessElement'

export class ChromelessDriver {
  constructor(wrapper) {
    this.wrapper = wrapper;
  }
  getElement (selector) {
    return new ChromelessElement(this.wrapper, selector)
  }
}
