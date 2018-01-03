import { CypressElement } from './CypressElement'

export class CypressDriver {
  getElement (selector) {
    return new CypressElement(selector)
  }
}