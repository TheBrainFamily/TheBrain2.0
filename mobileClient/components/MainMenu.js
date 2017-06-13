import React from 'react'
import { withRouter } from 'react-router'
import { Animated, Text, TouchableHighlight } from 'react-native'
import { FBLoginManager } from 'react-native-facebook-login'

import styles from '../styles/styles'

class MainMenu extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount() {
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

  goSignup = () => {
    this.props.history.push('/signup')
  }

  render () {
    let { fadeAnim } = this.state

    return (
      <Animated.View style={[styles.headerWithShadow, styles.menuOverlay, { opacity: fadeAnim }]}>
        {this.props.activated ?
          <TouchableHighlight
            onPress={this.logout}
            activeOpacity={1}
            underlayColor='#62c46caa'
            style={styles.menuButton}
            >
            <Text style={styles.menuButtonText}>Logout</Text>
          </TouchableHighlight>
          :
          <TouchableHighlight
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

export default withRouter(MainMenu)
