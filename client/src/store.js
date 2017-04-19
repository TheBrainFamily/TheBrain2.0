import { applyMiddleware, combineReducers, createStore } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware, routerReducer } from 'react-router-redux'
// import reducers from './reducers'

const history = createHistory()
const middleware = routerMiddleware(history)

const store = createStore(
  combineReducers({
    // ...reducers,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)

export { history }
export default store
