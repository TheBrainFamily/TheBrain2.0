import { CypressDriver } from './CypressDriver'

const startAppCypress = (path, networkInterface) => {
  cy.visit(`http://localhost:3000${path}`, {
    onLoad: (win) => {
      cy.spy(win.console, "log")
      if (win.__APOLLO_CLIENT__) {
        console.log("replacing network interface")
        Object.assign(win.__APOLLO_CLIENT__.networkInterface, networkInterface)
        win.__APOLLO_CLIENT__.resetStore()
      } else {
        console.log("existing apollo client?")
        win.__APOLLO_CLIENT__ = newClient;
      }
    }
  })

  return new CypressDriver()
}

export { startAppCypress }

