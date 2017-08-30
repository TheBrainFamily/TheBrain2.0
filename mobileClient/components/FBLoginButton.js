import React from 'react'
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import { withApollo, graphql } from 'react-apollo'
import { AsyncStorage } from 'react-native'
import logInWithFacebook from '../../client/shared/graphql/mutations/logInWithFacebook'

class FBLoginButton extends React.Component {

  logInWithFacebook = async (accessTokenFb, userIdFb) => {
    const user = await this.props.logInWithFacebook({ accessTokenFb, userIdFb})
    await AsyncStorage.setItem('accessTokenFb', accessTokenFb)
    await AsyncStorage.setItem('userIdFb', userIdFb)
  }

  render () {
    return (
      <FBLogin style={{ maxHeight: 40, justifyContent: 'center',}}
               ref={(fbLogin) => {
                 this.fbLogin = fbLogin
               }}
               permissions={['email']}
               loginBehavior={FBLoginManager.LoginBehaviors.Native}
               onLogin={(data) => {
                 console.log('Logged in!', data)
                 this.logInWithFacebook(data.credentials.token, data.credentials.userId)
                 this.props.history.push('/')
               }}
               onLogout={async () => {
                 await AsyncStorage.removeItem('accessTokenFb')
                 await AsyncStorage.removeItem('userIdFb')
                 console.log('Logged out.')
                 this.props.client.resetStore()
                 this.props.history.push('/')
               }}
               onLoginFound={(data) => {
                 console.log('Existing login found.', data)
                 console.log(data)
                 this.logInWithFacebook(data.credentials.token, data.credentials.userId)
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

export default withRouter(withApollo(graphql(logInWithFacebook, {
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
})(FBLoginButton)))
