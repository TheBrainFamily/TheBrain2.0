import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { ApolloClient } from 'apollo-client'
import { persistStore, autoRehydrate } from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'
import { networkInterface } from './networkInterface'
import createHistory from 'history/createBrowserHistory'

import * as reducers from './reducers'

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

persistStore(store, { storage: asyncSessionStorage, whitelist: ['course'] })

export { history }
export { client }
export default store
