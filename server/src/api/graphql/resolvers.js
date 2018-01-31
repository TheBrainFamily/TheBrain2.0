// @flow
import merge from 'lodash/merge'
import { coursesResolvers } from './coursesResolvers/index'
import { accountResolvers } from './accountResolvers/index'
import { userDetailsResolvers } from './userDetailsResolvers/index'
import { itemsResolvers } from './itemsResolvers/index'
import { lessonsResolvers } from './lessonsResolvers/index'
import { flashcardsResolvers } from './flashcardsResolvers/index'

process.on('unhandledRejection', (reason, p) => {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
  if (reason.graphQLErrors) {
    reason.graphQLErrors.forEach(err => {
      console.log('Graphql err', err)
    })
  }
})

export default merge(
  accountResolvers,
  coursesResolvers,
  flashcardsResolvers,
  itemsResolvers,
  lessonsResolvers,
  userDetailsResolvers)
