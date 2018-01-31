import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { ApolloClient } from 'apollo-client'
import { persistStore, autoRehydrate } from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'
import { networkInterface } from './networkInterface'
import createHistory from 'history/createBrowserHistory'
import { createLogger } from 'redux-logger'

import * as reducers from './reducers'

const client = new ApolloClient({
  networkInterface
})

const history = createHistory()

const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__

// TODO do only in dev
const logger = createLogger({
  predicate: (getState, action) => action.error
})

const createTheBrainStore = (history) => {
  return createStore(
    combineReducers({
      ...reducers,
      router: routerReducer,
      apollo: client.reducer()
    }),
    {}, // initial state
    compose(
      applyMiddleware(routerMiddleware(history), client.middleware(), logger),
      autoRehydrate(),
      devToolsExtension ? devToolsExtension() : f => f
    )
  )
}

const store = createTheBrainStore(history)

persistStore(store, {storage: asyncSessionStorage, whitelist: ['course']})

export { history }
export { client }
export { createHistory }
export { createTheBrainStore }
export default store
