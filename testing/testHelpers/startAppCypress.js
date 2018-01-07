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
        win.__APOLLO_CLIENT__ = newClient;
      }
    },
    onBeforeLoad: (win) => {
      win.sessionStorage.clear()
    }
  })

  return new CypressDriver()
}

export { startAppCypress }
