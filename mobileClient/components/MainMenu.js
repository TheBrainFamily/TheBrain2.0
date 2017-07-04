import React from 'react'
import { withRouter } from 'react-router'
import { compose, graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'

import { Animated, Text, View, TouchableHighlight } from 'react-native'
import { FBLoginManager } from 'react-native-facebook-login'

import styles from '../styles/styles'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'

class MainMenu extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 200
      }
    ).start()
  }

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

  goLogin = () => {
    this.props.history.push('/login')
  }

  goQuestions = () => {
    this.props.history.push('/questions')
  }

  goCongratulations = () => {
    this.props.history.push('/congratulations')
  }

  goSignup = () => {
    this.props.history.push('/signup')
  }

  render () {
    if (this.props.data.loading) {
      return <View />
    }
    let { fadeAnim } = this.state

    const currentUser = this.props.data.CurrentUser
    const activated = currentUser && currentUser.activated

    return (
      <Animated.View style={[styles.headerWithShadow, styles.menuOverlay, { opacity: fadeAnim }]}>
        {activated
          ? <TouchableHighlight
            onPress={this.logout}
            activeOpacity={1}
            underlayColor='#62c46caa'
            style={styles.menuButton}
            >
            <Text style={styles.menuButtonText}>Logout</Text>
          </TouchableHighlight>
          : <TouchableHighlight
            onPress={this.goLogin}
            activeOpacity={1}
            underlayColor='#62c46caa'
            style={styles.menuButton}
          >
            <Text style={styles.menuButtonText}>Login</Text>
          </TouchableHighlight>
        }
        <TouchableHighlight
          onPress={this.goQuestions}
          activeOpacity={1}
          underlayColor='#62c46caa'
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>Questions</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.goCongratulations}
          activeOpacity={1}
          underlayColor='#62c46caa'
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>Congratulations</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.goSignup}
          activeOpacity={1}
          underlayColor='#62c46caa'
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>Sign up</Text>
        </TouchableHighlight>
      </Animated.View>
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
  withApollo,
  withRouter,
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
)(MainMenu)
