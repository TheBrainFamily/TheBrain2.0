import { DetoxElement } from './DetoxElement'

export class DetoxDriver {
  getElement (selector) {
    return new DetoxElement(selector)
  }
}
