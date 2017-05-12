// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login'
import update from 'immutability-helper'

import currentUserQuery from '../../shared/graphql/queries/currentUser'

class Signup extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.currentUser || nextProps.currentUser.loading) {
      return
    }

    if (!nextProps.currentUser.CurrentUser || nextProps.currentUser.CurrentUser.activated) {
      nextProps.dispatch(push('/'))
    }
  }

  submit = (e) => {
    e.preventDefault()
    this.props.submit({ username: this.refs.username.value, password: this.refs.password.value })
      .then(() => {
        this.props.dispatch(push('/'))
      })
  }
    responseFacebook = (response: { accessToken: string }) => {
        console.log(response)
        this.props.logInWithFacebook({ accessToken: response.accessToken })
    }
  render () {
    if (this.props.currentUser.loading) {
      return <div>Loading...</div>
    }

    return (
      <form onSubmit={this.submit}>
        <div>
          <label>Username:</label>
          <input ref="username" type="text" name="username" />
        </div>
        <div>
          <label>Password:</label>
          <input ref="password" type="password" name="password" />
        </div>
        <div>
          <input type="submit" value="Signup" />
        </div>

          <FacebookLogin
              appId="***REMOVED***"
              autoLoad={false}
              fields="name,email,picture"
              callback={this.responseFacebook} />
      </form>)
  }
}

const signup = gql`
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!){
        setUsernameAndPasswordForGuest(username: $username, password: $password) {
            username
        }
    }
`

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`

export default compose(
  connect(),
  withRouter,
  graphql(signup, {
    props: ({ ownProps, mutate }) => ({
      submit: ({ username, password }) => mutate({
        variables: {
          username,
          password
        }
      })
    })
  }),
    graphql(logInWithFacebook, {
        props: ({ownProps, mutate}) => ({
            logInWithFacebook: ({accessToken}) => mutate({
                variables: {
                    accessToken
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
graphql(currentUserQuery, { name: 'currentUser' })
)(Signup)
