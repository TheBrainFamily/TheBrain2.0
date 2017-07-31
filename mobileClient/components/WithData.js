import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'

export default (Component, graphqlDataNames) => {
  return class DataContainer extends React.Component {
    state = {dataLoaded: false, isLoading: false, showRetry: false}

    componentWillReceiveProps = (nextPros) => {
      let networkFailure = false
      graphqlDataNames.forEach(dataName => {
        console.log('JMOZGAWA: this.props[dataName].networkStatus', dataName, this.props[dataName].networkStatus)
        if (this.props[dataName].networkStatus === 8) {
          networkFailure = true
        }
      })
      console.log('JMOZGAWA: networkFailure', networkFailure)
      if (networkFailure !== this.state.showRetry) {
        this.setState({showRetry: networkFailure})
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
          <View>
            <TouchableOpacity onPress={this.refetchData}>
              <Text style={[styles.button, {backgroundColor: '#68b888', paddingHorizontal: 50}]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
      return (<Component {...this.props}/>)
    }
  }
}