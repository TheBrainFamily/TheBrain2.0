import React from 'react'
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import gql from 'graphql-tag'
import { withApollo, graphql } from 'react-apollo'

class FBLoginButton extends React.Component {
  render () {
    return (
      <FBLogin style={{ marginVertical: 10 }}
               ref={(fbLogin) => {
                 this.fbLogin = fbLogin
               }}
               permissions={['email',]}
               loginBehavior={FBLoginManager.LoginBehaviors.Native}
               onLogin={(data) => {
                 console.log('Logged in!')
                 this.props.logInWithFacebook({ accessToken: data.credentials.token })
                 this.props.history.push('/')
               }}
               onLogout={() => {
                 console.log('Logged out.')
                 this.props.client.resetStore()
                 this.props.history.push('/')
               }}
               onLoginFound={(data) => {
                 console.log('Existing login found.')
                 console.log(data)
                 this.props.logInWithFacebook({ accessToken: data.credentials.token })
               }}
               onLoginNotFound={() => {
                 console.log('No user logged in.')
               }}
               onError={(data) => {
                 console.log('ERROR')
                 console.log(data)
               }}
               onCancel={() => {
                 console.log('User cancelled.')
               }}
               onPermissionsMissing={(data) => {
                 console.log('Check permissions!')
                 console.log(data)
               }}
      />
    )
  };

}

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`

export default withRouter(withApollo(graphql(logInWithFacebook, {
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
})(FBLoginButton)))
