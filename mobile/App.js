// @flow

import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { AppRegistry, AsyncStorage } from 'react-native'
import { Font } from 'expo'

import store, { client } from './store'
import { AppInternal } from './AppInternal'

export default class App extends Component {
  state = {
    fontLoaded: false
  }

  // TODO move this out
  async componentDidMount () {
    // eslint-disable-next-line
    if (true) { // TODO figure out how to make this only happen in e2e tests
      if (await AsyncStorage.getAllKeys()) {
        await AsyncStorage.clear()
      }
    }
    await Font.loadAsync({
      'Exo2-Regular': require('./fonts/Exo2-Regular.ttf'),
      'Exo2-Bold': require('./fonts/Exo2-Bold.ttf'),
      'Kalam-Bold': require('./fonts/Kalam-Bold.ttf'),
      'Kalam-Regular': require('./fonts/Kalam-Regular.ttf')
    })
    this.setState({fontLoaded: true})
  }

  render () {
    return (
      <ApolloProvider client={client} store={store}>
        <AppInternal fontLoaded={this.state.fontLoaded} />
      </ApolloProvider>
    )
  }
};

AppRegistry.registerComponent('mobile', () => App)
