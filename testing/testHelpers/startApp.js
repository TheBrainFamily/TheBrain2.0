import {
  makeExecutableSchema
} from 'graphql-tools'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { typeDefs } from '../../server/src/api/schema'
import resolvers from '../../server/src/api/resolvers'

const isEnzyme = process.env.ENZYME
const isTestCafe = process.env.TESTCAFE
let startApp = async function (path = '/', context, testCafe) {
  const schema = makeExecutableSchema({typeDefs, resolvers})
  // path = `#${path}`
  const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
  if (global.cy) {
    const { startAppCypress } = require('./startAppCypress')
    return startAppCypress(path, networkInterface)
  } else if (isEnzyme) { // TODO better check for jest ;-)
    const startAppEnzyme = require('./startAppEnzyme').startAppEnzyme
    return startAppEnzyme(path, networkInterface)
  } else if (isTestCafe) {
    // For some reason if I put this inside startAppTestCafe I get
    // Cannot implicitly resolve the test run in the context of which the test controller action should be executed. Use test function's 't' argument instead.
    // whatever that means :)
    // const newT = require('testcafe').t
    // await newT.navigateTo(`http://localhost:8080${path}`)
    // const startAppTestCafe = require('./startAppTestCafe').startAppTestCafe
    // return startAppTestCafe(path, typeDefs, resolvers)
  } else { // TODO better check for chromeless
    // const startAppChromeless = require('./startAppChromeless').startAppChromeless
    // return startAppChromeless(path, typeDefs, resolvers)
  }
}

export default startApp
