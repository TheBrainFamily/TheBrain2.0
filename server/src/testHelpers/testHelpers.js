// @flow

import _ from 'lodash'

export function extendExpect () {
  expect.extend({
    toContainDocuments (received, expected) {
      let notFoundDocuments = []
      _.forEach(expected, (doc) => {
        if (_.findIndex(received, doc) === -1) {
          notFoundDocuments.push(doc)
        }
      })
      const pass = notFoundDocuments.length === 0
      let message
      if (!pass) {
        message = `documents ${this.utils.printExpected(notFoundDocuments)} not found in the array ${this.utils.printReceived(received)}`
      }

      // const message = pass
      //           ? () => this.utils.matcherHint('.not.toBe') + '\n\n' +
      //       `Expected value to not be (using ===):\n` +
      //       `  ${this.utils.printExpected(expected)}\n` +
      //       `Received:\n` +
      //       `  ${this.utils.printReceived(received)}`
      //           : () => {
      //           // const diffString = diff(expected, received, {
      //           //     expand: this.expand,
      //           // });
      //           // TODO: fix message
      //             const diffString = ''
      //             return this.utils.matcherHint('.toBe') + '\n\n' +
      //               `Expected value to be (using ===):\n` +
      //               `  ${this.utils.printExpected(expected)}\n` +
      //               `Received:\n` +
      //               `  ${this.utils.printReceived(received)}` +
      //               (diffString ? `\n\nDifference:\n\n${diffString}` : '')
      //           }

      return {actual: received, message, pass}
    }
  })
}

export function deepFreeze (obj: Object) {
  const propNames = Object.getOwnPropertyNames(obj)

  propNames.forEach((name) => {
    const prop = obj[name]

    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop)
    }
  })

  return Object.freeze(obj)
}
