import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'

export default (Component, graphqlDataNames) => {
  return class DataContainer extends React.Component {
    state = { dataLoaded: false, isLoading: false, showRetry: false }

    componentWillReceiveProps = (nextPros) => {
      let networkFailure = false
      graphqlDataNames.forEach(dataName => {
        if (this.props[dataName].networkStatus === 8) {
          networkFailure = true
        }
      })

      if (networkFailure !== this.state.showRetry) {
        this.setState({ showRetry: networkFailure })
      }
    }

    refetchData = () => {
      graphqlDataNames.forEach(dataName => this.props[dataName].refetch())
      this.setState({
        showRetry: false
      })
    }

    render () {
      if (this.state.showRetry) {
        return (
          <View style={style.container}>
            <Text style={[styles.textDefault]}>
              No Internet connection
            </Text>
            <TouchableOpacity onPress={this.refetchData}>
              <Text style={[styles.button, { backgroundColor: '#68b888', paddingHorizontal: 50 }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
      return (<Component {...this.props} />)
    }
  }
}

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60
  }
})
