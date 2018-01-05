import { createNetworkInterface } from 'apollo-client'

let uri
const localhostRegexp = /localhost/

if (localhostRegexp.test(window.location.origin)) {
  uri = 'http://localhost:8080/graphql'
} else {
  uri = 'https://api.thebrain.pro/graphql'
}

console.log('GraphQL uri:', uri)

const networkInterface = createNetworkInterface({
  uri,
  opts: {
    credentials: 'include'
  }
})

export {networkInterface}
