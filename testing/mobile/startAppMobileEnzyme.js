import {
  makeExecutableSchema
} from 'graphql-tools'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { typeDefs } from '../../server/src/api/schema'
import resolvers from '../../server/src/api/resolvers'
import { ApolloClient } from 'apollo-client'
import { MobileEnzymeDriver } from './helpers/MobileEnzymeDriver'

const schema = makeExecutableSchema({typeDefs, resolvers})

const { React, Enzyme, ApolloProvider } = require('../../mobile/tests/helpers/setup')
// const React = require('react')
// const Enzyme = require('enzyme');
// const ApolloProvider = require('react-apollo').default
const {returnStore} = require('../../mobile/store')

// const Separator = require('../mobile/components/Separator').default
const { AppInternal } = require('../../mobile/AppInternal')
// console.log("Gandecki AppInternal", AppInternal);
// const store = require('../store').default

const startAppMobileEnzyme = (context) => {
  const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

  const client = new ApolloClient({networkInterface})
  const store = returnStore(client)
  const wrapper = Enzyme.mount(<ApolloProvider client={client} store={store}><AppInternal fontLoaded /></ApolloProvider>)
  return new MobileEnzymeDriver(wrapper)
}

export {startAppMobileEnzyme}
