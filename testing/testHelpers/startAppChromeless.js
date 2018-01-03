import { ChromelessDriver } from './ChromelessDriver'

//TODO extract this to separate function for other drivers to use
const stringify = function (obj) {

  return JSON.stringify(obj, function (key, value) {
    var fnBody;
    if (value instanceof Function || typeof value == 'function') {


      fnBody = value.toString();

      if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
        return '_NuFrRa_' + fnBody;
      }
      return fnBody;
    }
    if (value instanceof RegExp) {
      return '_PxEgEr_' + value;
    }
    return value;
  });
}

const startAppChromeless = async (path, typeDefs, resolvers) => {
  const Chromeless = require('chromeless').Chromeless
  const chromeless = new Chromeless()

  const stringifiedResolvers = stringify(resolvers)

  const wrapper = chromeless.goto(`http://localhost:8080${path}`).evaluate((stringifiedResolversInside, typeDefs) => {
      if (window.__APOLLO_CLIENT__) {

        const parsedResolvers = window.__APOLLO_TEST_TOOLS.parse(stringifiedResolversInside)

        const schema = window.__APOLLO_TEST_TOOLS.makeExecutableSchema({typeDefs, resolvers: parsedResolvers})
        window.__APOLLO_TEST_TOOLS.addMockFunctionsToSchema({schema, preserveResolvers: true})

        const newNetworkInterface = window.__APOLLO_TEST_TOOLS.mockNetworkInterfaceWithSchema({schema})

        Object.assign(window.__APOLLO_CLIENT__.networkInterface, newNetworkInterface)
      }
    },stringifiedResolvers, typeDefs
  ) // evaluate strips functions passed in..
  return new ChromelessDriver(wrapper, path)
}

export { startAppChromeless }

