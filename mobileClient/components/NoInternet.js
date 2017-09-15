import React from 'react'
import { withRouter } from 'react-router'
import { client } from '../store'
import { compose } from 'react-apollo'
import { Text, TouchableOpacity, View } from 'react-native'
import styles from '../styles/styles'
import Header from './Header'
import { connect } from 'react-redux'
import * as courseActions from '../actions/CourseActions'

class NoInternet extends React.Component {
  refetchData = () => {
    client.resetStore()
    this.props.dispatch(courseActions.close())
    this.props.history.push('/')
  }

  render () {
    return (
      <View style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#9050ba'
      }}>
        <Header withShadow dynamic hideHamburger={true}/>
        <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={[styles.textDefault]}>
            No Internet connection
          </Text>
          <TouchableOpacity onPress={this.refetchData}>
            <Text style={[styles.button, { backgroundColor: '#68b888', paddingHorizontal: 50 }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default  compose(
  connect(state => state),
  withRouter
)(NoInternet)

const mutationConnectionHandler = async (history, action) => {
  try {
    await action()
  } catch (exception) {
    console.log("JMOZGAWA: exception",exception);
    history.push('/nointernet')
  }
}

export { mutationConnectionHandler }

