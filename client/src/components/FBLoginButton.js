// @flow

import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import FacebookLogin from 'react-facebook-login'
import update from 'immutability-helper'

class FBLoginButton extends React.Component {
  responseFacebook = (response: { accessToken: string }) => {
    console.log(response)
    this.props.logInWithFacebook({ accessToken: response.accessToken })

    this.props.onLogin && this.props.onLogin()
  }

  render () {
    return (
      <FacebookLogin
        appId='***REMOVED***'
        autoLoad={false}
        fields='name,email,picture'
        callback={this.responseFacebook}
      />
    )
  }
}

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`

export default graphql(logInWithFacebook, {
  props: ({ ownProps, mutate }) => ({
    logInWithFacebook: ({ accessToken }) => mutate({
      variables: {
        accessToken
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
