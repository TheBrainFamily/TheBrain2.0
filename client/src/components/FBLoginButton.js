// @flow

import React from 'react'
import { graphql } from 'react-apollo'
import FacebookLogin from 'react-facebook-login'
import update from 'immutability-helper'
import logInWithFacebook from '../../shared/graphql/mutations/logInWithFacebook'

class FBLoginButton extends React.Component {
  responseFacebook = (response: { accessToken: string, userID: string }) => {
    console.log('logInWithFacebook', response)
    const accessTokenFb = response.accessToken
    const userIdFb = response.userID
    this.props.logInWithFacebook({ accessTokenFb, userIdFb })
    if(userIdFb && accessTokenFb) {
      localStorage.setItem('accessTokenFb', accessTokenFb)
      localStorage.setItem('userIdFb', userIdFb)
    }
    this.props.onLogin && this.props.onLogin()
  }

  render () {
    return (
      <FacebookLogin
        cssClass={'login-button-fb'}
        appId='***REMOVED***'
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
        userIdFb,
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
