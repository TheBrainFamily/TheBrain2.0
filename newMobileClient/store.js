import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'
import { ApolloClient } from 'apollo-client'
import reducers from './reducers'
import devTools from 'remote-redux-devtools'
import { networkInterface } from './networkInterface'

const client = new ApolloClient({
  networkInterface
})

//TODO this file needs a clean up! we create the store and client and in tests we create different ones - this should be streamlined similarly to what we do in web client
const history = createHistory()

const returnStore = (client, history = createHistory()) => {
  return createStore(
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
}

const store = returnStore(client, history)

export {returnStore}

export {createStore}

export default store
export { client }
