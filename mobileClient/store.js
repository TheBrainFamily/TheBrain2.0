import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import reducers from './reducers'
import devTools from 'remote-redux-devtools'

import config from './.config-dev'

const graphqlUri = config.graphqlUri || 'http://localhost:8080/graphql'

const networkInterface = createNetworkInterface({
  uri: graphqlUri,
  opts: {
    credentials: 'include'
  }
})

const client = new ApolloClient({
  networkInterface
})

const history = createHistory()

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
    apollo: client.reducer()
  }),
  {}, // initial state
  compose(
    applyMiddleware(routerMiddleware(history), client.middleware()),
    devTools()
  )
)

export default store
export { client }
