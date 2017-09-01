import React from 'react'
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import { withApollo, graphql, compose } from 'react-apollo'
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import logInWithFacebook from '../../client/shared/graphql/mutations/logInWithFacebook'
import userDetailsQuery from '../../client/shared/graphql/queries/userDetails'
import * as courseActions from '../actions/CourseActions'

class FBLoginButton extends React.Component {

  logInWithFacebook = async (accessTokenFb, userIdFb) => {
    this.props.dispatch(courseActions.close())
    await this.props.logInWithFacebook({ accessTokenFb, userIdFb})
    await AsyncStorage.setItem('accessTokenFb', accessTokenFb)
    await AsyncStorage.setItem('userIdFb', userIdFb)
    await this.props.userDetails.refetch()
    this.props.history.push('/')
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
               }}
               onLogout={async () => {
                 console.log('Logged out FB.')
                 this.props.history.push('/')
               }}
               onLoginFound={(data) => {
                 console.log('Existing login found.', data)
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

export default withRouter(withApollo(compose(
  connect(),
  graphql(logInWithFacebook, {
    props: ({ownProps, mutate}) => ({
      logInWithFacebook: ({accessTokenFb, userIdFb}) => mutate({
        variables: {
          accessTokenFb,
          userIdFb
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebook
              }
            })
          }
        }
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }))
  (FBLoginButton)))
