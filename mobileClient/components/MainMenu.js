import React from 'react'
import { withRouter } from 'react-router'
import { View, Text, TouchableHighlight } from 'react-native'
import { FBLoginManager } from 'react-native-facebook-login'

import styles from '../styles/styles'

class MainMenu extends React.Component {
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
    return (
      <View style={[styles.headerWithShadow, styles.menuOverlay]}>
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
      </View>
    )
  }
}

export default withRouter(MainMenu)
