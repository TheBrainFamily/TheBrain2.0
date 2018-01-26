import { createNetworkInterface } from 'apollo-client'
const graphqlUri = 'http://192.168.1.100:8080/graphql'

const networkInterface = createNetworkInterface({
  uri: graphqlUri,
  opts: {
    credentials: 'include'
  }
})

export { networkInterface }
