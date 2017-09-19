import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import { persistStore, autoRehydrate } from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'

import * as reducers from './reducers'

let uri
const localhostRegexp = /localhost/

if (localhostRegexp.test(window.location.origin)) {
  uri = 'http://localhost:8080/graphql'
} else {
  uri = 'https://sleepy-stream-93575.herokuapp.com/graphql'
}

console.log('GraphQL uri:', uri)

const networkInterface = createNetworkInterface({
  uri,
  opts: {
    credentials: 'include'
  }
})

const client = new ApolloClient({
  networkInterface
})

const history = createHistory()

const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    apollo: client.reducer()
  }),
  {}, // initial state
  compose(
    applyMiddleware(routerMiddleware(history), client.middleware()),
    autoRehydrate(),
    devToolsExtension ? devToolsExtension() : f => f
  )
)

persistStore(store, { storage: asyncSessionStorage })

export { history }
export { client }
export default store
