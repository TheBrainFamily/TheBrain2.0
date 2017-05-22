import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Link } from 'react-router-native'
import { connect } from 'react-redux'
import { withApollo, compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { FBLoginManager } from 'react-native-facebook-login'

import Header from './Header'
import Lecture from './Lecture'

import styles from '../styles/styles'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'

class Home extends React.Component {
  logout = () => {
    this.props.logout()
      .then(() => {
        FBLoginManager.getCredentials((error, data) => {
          if (!error && data && data.credentials) {
            FBLoginManager.logout(() => {}) // any callback is required
          }
        })
        this.props.client.resetStore()
      })
  }

  render () {
    if (this.props.data.loading) {
      return <View />
    }

    const currentUser = this.props.data.CurrentUser
    const activated = currentUser && currentUser.activated

    return (
      <View>
        <Header />

        {activated
          ? <View style={{ margin: 10 }}>
            <TouchableOpacity onPress={this.logout}>
              <Text style={styles.button}>Logout</Text>
            </TouchableOpacity>
          </View>
          : <View style={{ margin: 10 }}>
            <Link to='/login'>
              <Text style={styles.button}>Login</Text>
            </Link>
          </View>
        }

        <Lecture />
      </View>
    )
  }
}

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id, username, activated
        }
    }
`

export default compose(
  connect(),
  withApollo,
  graphql(logOutQuery, {
    props: ({ ownProps, mutate }) => ({
      logout: () => mutate({
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logOut
              }
            })
          }
        }
      })
    })
  }),
  graphql(currentUserQuery)
)(Home)
