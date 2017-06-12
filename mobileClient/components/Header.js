import React from 'react'
import { withRouter } from 'react-router'
import { compose, graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import { FBLoginManager } from 'react-native-facebook-login'

import Hamburger from 'react-native-hamburger'

import logoBig from '../images/logoBig.svg'
import styles from '../styles/styles'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  goHome = () => {
    this.props.history.push('/')
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

  hideMenu = () => {
    this.setState({ active: !this.state.active })
  }

  render () {
    if (this.props.data.loading) {
      return <View />
    }

    const headerStyle = [styles.header]
    if (this.props.withShadow) {
      headerStyle.push(styles.headerWithShadow)
    }

    const currentUser = this.props.data.CurrentUser
    const activated = currentUser && currentUser.activated

    return (
      <View style={{ position: 'relative', zIndex: 1000 }}>
        <View style={headerStyle}>
          <TouchableOpacity onPress={this.goHome}>
            <SvgUri
              style={ styles.headerLogo }
              width="250"
              height="65"
              source={logoBig}
            />
          </TouchableOpacity>

          <Hamburger
            active={this.state.active}
            color="#662e8f"
            type="spinCross"
            onPress={this.hideMenu}
            style={{ marginTop: 30, flex: 1 }}
          />
        </View>

        {this.state.active &&
          <View style={[styles.headerWithShadow, styles.menuOverlay]}>
            {activated ?
              <TouchableHighlight
                onPress={this.logout}
                activeOpacity={1}
                underlayColor="#62c46caa"
                style={ styles.menuButton }
              >
                <Text style={ styles.menuButtonText }>Logout</Text>
              </TouchableHighlight>
              :
              <TouchableHighlight
                onPress={this.goLogin}
                activeOpacity={1}
                underlayColor="#62c46caa"
                style={ styles.menuButton }
              >
                <Text style={ styles.menuButtonText }>Login</Text>
              </TouchableHighlight>
            }
            <TouchableHighlight
              onPress={this.goQuestions}
              activeOpacity={1}
              underlayColor="#62c46caa"
              style={ styles.menuButton }
            >
              <Text style={ styles.menuButtonText }>Questions</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.goSignup}
              activeOpacity={1}
              underlayColor="#62c46caa"
              style={ styles.menuButton }
            >
              <Text style={ styles.menuButtonText }>Sign up</Text>
            </TouchableHighlight>
          </View>
        }
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
)(Header)
