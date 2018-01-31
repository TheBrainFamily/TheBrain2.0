import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { typeDefs } from '../../server/src/api/graphql/schema'
import resolvers from '../../server/src/api/graphql/resolvers'

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
        return eval('(' + value + ')') // eslint-disable-line
      }
      if (prefix === '_PxEgEr_') {
        return eval(value.slice(8)) // eslint-disable-line
      }
      if (prefix === '_NuFrRa_') {
        return eval(`(function ${value.slice(8)})`) // eslint-disable-line
      }

      return value
    })
  }
}
const schema = makeExecutableSchema({typeDefs, resolvers})
export { schema }
export default mockNetworkInterfaceWithSchema({schema})
