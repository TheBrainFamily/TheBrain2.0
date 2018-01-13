import { makeExecutableSchema, addMockFunctionsToSchema, mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import schema from '../../../server/src/api/schema'

// TODO leaving this here since it might possibly be used by detox, if not, delete the whole madness
window.__APOLLO_TEST_TOOLS = {
  mockNetworkInterfaceWithSchema,
  addMockFunctionsToSchema,
  makeExecutableSchema,
  stringify: function (obj) {
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
  },
  parse: function (str, date2obj) {
    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false

    return JSON.parse(str, function (key, value) {
      var prefix

      if (typeof value !== 'string') {
        return value
      }
      if (value.length < 8) {
        return value
      }

      prefix = value.substring(0, 8)

      if (iso8061 && value.match(iso8061)) {
        return new Date(value)
      }
      if (prefix === 'function') {
        // eslint-disable-next-line no-eval
        return eval('(' + value + ')')
      }
      if (prefix === '_PxEgEr_') {
        // eslint-disable-next-line no-eval
        return eval(value.slice(8))
      }
      if (prefix === '_NuFrRa_') {
        // eslint-disable-next-line no-eval
        return eval(`(function ${value.slice(8)})`)
      }

      return value
    })
  }
}
export { schema }

const networkInterface = mockNetworkInterfaceWithSchema({schema})

export { networkInterface }
