// @flow
/* eslint-env browser */

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import FBLoginButton from './FBLoginButton'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import TextField from 'material-ui/TextField'

import currentUserQuery from '../../shared/graphql/queries/currentUser'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'

class Login extends React.Component {
  state = {
    error: '',
    isSignup: false,
    saveToken: false
  }

  loginButtonLabels = {
    login: 'LOGIN',
    signup: 'SIGNUP'
  }

  getLoginButtonLabel = (isSignup) => {
    return isSignup ? this.loginButtonLabels.signup : this.loginButtonLabels.login
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.path === '/signup') {
      this.setState({isSignup: true})
    }
  }

  submit = (e) => {
    e.preventDefault()
    const deviceId = 'browser'
    const saveToken = this.state.saveToken
    let submitAction = this.props.login
    if (this.refs.isSignup.checked) {
      submitAction = this.props.signup
    }
    this.setState({ error: '' })

    submitAction({ username: this.refs.username.input.value, password: this.refs.password.input.value, deviceId, saveToken })
      .then(() => {
        if (saveToken) {
          const accessToken = this.props.currentUser.CurrentUser.currentAccessToken
          const userId = this.props.currentUser.CurrentUser._id
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('userId', userId)
        }
        this.redirectAfterLogin()
      })
      .catch((data) => {
        const error = data.graphQLErrors[0].message
        this.setState({ error })
      })
  }

  redirectAfterLogin = async () => {
    await this.props.userDetails.refetch()
    this.props.dispatch(push('/'))
  }

  checkboxClick = () => {
    this.setState({isSignup: !this.state.isSignup})
  }

  checkboxClickSave = () => {
    this.setState({saveToken: !this.state.saveToken})
  }

  render () {
    return (
      <FlexibleContentWrapper>
        <h1>{ this.state.isSignup ? 'Sign up' : 'Sign in' } and stay educated</h1>
        <form className={'login-form'} onSubmit={this.submit}>
          <FBLoginButton onLogin={this.redirectAfterLogin} />
          <p>
            OR
          </p>
          {this.state.error && <div className='text-error'>{ this.state.error }</div>}
          <div>
            <TextField
              ref='username'
              hintText='Username'
              floatingLabelText='Username'
            />
          </div>
          <div>
            <TextField
              ref='password'
              hintText='Password'
              floatingLabelText='Password'
              type='password'
            />
          </div>
          <div className='mt-1'>
            <input ref='saveToken' type='checkbox' name='saveToken' checked={this.state.saveToken}
              onChange={this.checkboxClickSave} />
            <label className={'checkbox-label'} onClick={this.checkboxClickSave}>Remember me</label>
          </div>
          <div>
            <input ref='isSignup' type='checkbox' name='newAccount' checked={this.state.isSignup}
              onChange={this.checkboxClick} />
            <label className={'checkbox-label'} onClick={this.checkboxClick}>New account</label>
          </div>
          <div className={'login-form-buttons-container'}>
            <input className={'login-button'} type='submit' value={this.getLoginButtonLabel(this.state.isSignup)} />
          </div>
        </form>
      </FlexibleContentWrapper>
    )
  }
}
const logIn = gql`
    mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean){
        logIn(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

const signup = gql`
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean){
        setUsernameAndPasswordForGuest(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export default compose(
  connect(),
  withRouter,
  graphql(logIn, {
    props: ({ownProps, mutate}) => ({
      login: ({username, password, deviceId, saveToken}) => mutate({
        variables: {
          username,
          password,
          deviceId,
          saveToken
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logIn
              }
            })
          }
        }
      })
    })
  }),
  graphql(signup, {
    props: ({ownProps, mutate}) => ({
      signup: ({username, password, deviceId, saveToken}) => mutate({
        variables: {
          username,
          password,
          deviceId,
          saveToken
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.setUsernameAndPasswordForGuest
              }
            })
          }
        }
      })
    })
  }),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Login)
