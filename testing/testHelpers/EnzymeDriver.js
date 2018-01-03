import { EnzymeElement } from './EnzymeElement'
import { jQueryElement } from './jQueryElement'
import saveHtml from './saveHtml'
import flushAllPromises from './flushAllPromises'

export class EnzymeDriver {
  constructor (wrapper) {
    wrapper.refresh = this.refresh.bind(this);
    this.wrapper = wrapper;
    return this.wrapper.refresh()
  }

  getElement (selector) {
    if (this.wrapper.find(selector).length) {
      return new EnzymeElement(this.wrapper, selector)
    } else {
      return new jQueryElement(selector)
    }
  }

  async refresh() {
    //TODO can we somehow make sure that we flush all the existing promises, and then also the promises
    // that are created (?) as a result of this flush?
    // otherwise we could have this in a loop that would be configurable via some kind of a threshold.
    // We could think of this similarly to a waitFor-kind timeouts in e2e testing

    await flushAllPromises()
    await flushAllPromises()
    await flushAllPromises()
    await flushAllPromises()
    await flushAllPromises()
    await flushAllPromises()
    this.wrapper.update()
    this.wrapper.mount()
    return this;
  }

  get html () {
    return this.wrapper.html()
  }

  async saveHtml () {
    await saveHtml(this.wrapper)
  }
}