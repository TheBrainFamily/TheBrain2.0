// @flow

import { combineReducers, createStore, compose } from 'redux'
import { routerReducer } from 'react-router-redux'
import {ApolloClient, createNetworkInterface} from 'apollo-client';
import flashcardReducer from './reducers/FlashcardReducer';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  opts: {
    credentials: 'include',
  },
});

const client = new ApolloClient({
  networkInterface,
});

const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(
  combineReducers({
    // ...reducers,
    flashcard: flashcardReducer,
    router: routerReducer,
    apollo: client.reducer(),
  }),
  {}, // initial state
  compose(
    devToolsExtension ? devToolsExtension() : f => f,
  )
)

export default store;
export { client };
