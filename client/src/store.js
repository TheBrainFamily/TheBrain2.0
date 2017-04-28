import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { ApolloClient, createNetworkInterface } from 'apollo-client'

import * as reducers from './reducers'

let uri
const localhostRegexp = /localhost/

if (localhostRegexp.test(window.location.origin)) {
  uri = 'http://localhost:8080/graphql'
} else {
  uri = 'http://new.thebrain.pro:8080/graphql'
}

console.log('GraphQL uri:', uri)

const networkInterface = createNetworkInterface({
  uri,
  opts: {
    credentials: 'include',
  },
})

const client = new ApolloClient({
  networkInterface,
})

const history = createHistory()

const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    apollo: client.reducer(),
  }),
  {}, // initial state
  compose(
    applyMiddleware(routerMiddleware(history), client.middleware()),
    devToolsExtension ? devToolsExtension() : f => f,
  )
)

export { history }
export { client }
export default store
