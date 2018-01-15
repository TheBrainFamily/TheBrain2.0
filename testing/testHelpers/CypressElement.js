export class CypressElement {
  constructor (selector) {
    this.selector = selector
  }

  get el() {
    return cy.get(this.selector)
  }

  async click () {
    this.el.first().click({ force: true })
  }

  async setValue (value) {
    this.el.first().type(value)
  }

  assertContentMatches(textToMatch) {
    this.el.contains(textToMatch)
  }
  assertIsVisible() {
    this.el.should('exist')
  }

  assertNotVisible() {
    //TODO why is first() returning html here?
    this.el.should('not.exist')
  }

}