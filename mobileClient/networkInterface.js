import { createNetworkInterface } from 'apollo-client'
const graphqlUri = 'http://127.0.0.1:8080/graphql'

const networkInterface = createNetworkInterface({
  uri: graphqlUri,
  opts: {
    credentials: 'include'
  }
})

export { networkInterface }
