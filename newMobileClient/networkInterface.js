import { createNetworkInterface } from 'apollo-client'
const graphqlUri = 'http://192.168.101.124:8080/graphql'

const networkInterface = createNetworkInterface({
  uri: graphqlUri,
  opts: {
    credentials: 'include'
  }
})

export { networkInterface }