// @flow
/* eslint-env browser */

import React from 'react'
import { graphql } from 'react-apollo'
import FacebookLogin from 'react-facebook-login'
import update from 'immutability-helper'
import logInWithFacebook from 'thebrain-shared/graphql/mutations/logInWithFacebook'

class FBLoginButton extends React.Component {
  responseFacebook = async (response: { accessToken: string, userID: string }) => {
    console.log('logInWithFacebook', response)
    if (response.status === 'unknown') {
      console.log('logInWithFacebook status', response.status)
      return
    }
    const accessTokenFb = response.accessToken
    const userIdFb = response.userID
    await this.props.logInWithFacebook({ accessTokenFb, userIdFb })
    if (userIdFb && accessTokenFb) {
      localStorage.setItem('accessTokenFb', accessTokenFb)
      localStorage.setItem('userIdFb', userIdFb)
    }
    this.props.onLogin && this.props.onLogin()
  }

  render () {
    return (
      <FacebookLogin
        cssClass={'login-button-fb'}
        appId='1621044308126388'
        autoLoad={false}
        callback={this.responseFacebook}
      />
    )
  }
}

export default graphql(logInWithFacebook, {
  props: ({ ownProps, mutate }) => ({
    logInWithFacebook: ({ accessTokenFb, userIdFb }) => mutate({
      variables: {
        accessTokenFb,
        userIdFb
      },
      updateQueries: {
        CurrentUser: (prev, { mutationResult }) => {
          return update(prev, {
            CurrentUser: {
              $set: mutationResult.data.logInWithFacebook
            }
          })
        }
      }
    })
  })
}
)(FBLoginButton)
