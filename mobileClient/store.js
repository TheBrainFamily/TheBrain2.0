import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import reducers from './reducers'
import devTools from 'remote-redux-devtools'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
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
