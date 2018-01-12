/* eslint-env jest */
const MockAsyncStorage = require('mock-async-storage').default
const mockImpl = new MockAsyncStorage()
jest.mock('AsyncStorage', () => mockImpl)

const { JSDOM } = require('jsdom')

const jsdom = new JSDOM()
const { window } = jsdom// console.log("Gandecki JSDOM", JSDOM);

function copyProps (src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop))
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}
copyProps(window, global)

// Setup adapter to work with enzyme 3.2.0

const Enzyme = require('enzyme')
const React = require('react')
const Adapter = require('enzyme-adapter-react-16')

Enzyme.configure({ adapter: new Adapter() })

// Ignore React Web errors when using React Native
console.error = (message) => {
  return message
}

require('react-native-mock-render/mock')

const ApolloProvider = require('react-apollo/ApolloProvider').default

module.exports = {
  Enzyme,
  React,
  ApolloProvider
}
