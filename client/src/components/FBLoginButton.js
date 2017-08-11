// @flow

import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import FacebookLogin from 'react-facebook-login'
import update from 'immutability-helper'

class FBLoginButton extends React.Component {
  responseFacebook = (response: { accessToken: string, name: string, email: string }) => {
    console.log('logInWithFacebook', response)
    this.props.logInWithFacebook({ accessToken: response.accessToken, username: response.name, email: response.email })
    this.props.onLogin && this.props.onLogin()
  }

  render () {
    return (
      <FacebookLogin
        cssClass={'login-button-fb'}
        appId='794881630542767'
        autoLoad={false}
        fields='name,email'
        callback={this.responseFacebook}
      />
    )
  }
}

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!, $username: String!, $email: String){
        logInWithFacebook(accessToken:$accessToken, username:$username, email:$email) {
            _id, username, activated, email
        }
    }
`

export default graphql(logInWithFacebook, {
  props: ({ ownProps, mutate }) => ({
    logInWithFacebook: ({ accessToken, username, email }) => mutate({
      variables: {
        accessToken,
        username,
        email
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
