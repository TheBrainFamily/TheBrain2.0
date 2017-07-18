// @flow

import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import store, { client } from './store'
import MainContainer from './components/MainContainer'
import './App.css'

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client} store={store}>
        <MainContainer/>
      </ApolloProvider>
    )
  }
}
export default App
