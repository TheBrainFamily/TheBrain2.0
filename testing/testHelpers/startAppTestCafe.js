const TestCafeDriver = require('./TestCafeDriver').TestCafeDriver
const t = require('testcafe').t

// TODO extract this to separate function
const stringify = function (obj) {
  return JSON.stringify(obj, function (key, value) {
    var fnBody
    if (value instanceof Function || typeof value === 'function') {
      fnBody = value.toString()

      if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { // this is ES6 Arrow Function
        return '_NuFrRa_' + fnBody
      }
      return fnBody
    }
    if (value instanceof RegExp) {
      return '_PxEgEr_' + value
    }
    return value
  })
}

const startAppTestCafe = async (path, typeDefs, resolvers) => {
  const stringifiedResolvers = stringify(resolvers)
  await t.eval(() => {
    if (window.__APOLLO_CLIENT__) {
      const parsedResolvers = window.__APOLLO_TEST_TOOLS.parse(stringifiedResolvers)

      const schema = window.__APOLLO_TEST_TOOLS.makeExecutableSchema({typeDefs, resolvers: parsedResolvers, resolverValidationOptions: {allowResolversNotInSchema: true}})
      window.__APOLLO_TEST_TOOLS.addMockFunctionsToSchema({schema, preserveResolvers: true})

      const newNetworkInterface = window.__APOLLO_TEST_TOOLS.mockNetworkInterfaceWithSchema({schema})

      Object.assign(window.__APOLLO_CLIENT__.networkInterface, newNetworkInterface)
    }
  }, {
    dependencies: {stringifiedResolvers, typeDefs}
  })

  return new TestCafeDriver()
}

exports.startAppTestCafe = startAppTestCafe
