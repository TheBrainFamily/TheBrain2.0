// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import FBLoginButton from './FBLoginButton'
import FlexibleContentWrapper from './FlexibleContentWrapper'

import currentLessonQuery from '../../shared/graphql/queries/currentLesson'
import currentUserQuery from '../../shared/graphql/queries/currentUser'

class Login extends React.Component {
  state = {
    error: '',
    isSignup: false
  }

  loginButtonLabels = {
    login: 'Login',
    signup: 'Signup'
  }

  getLoginButtonLabel = (isSignup) => {
    return isSignup ? this.loginButtonLabels.signup : this.loginButtonLabels.login
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.match.path === '/signup') {
      this.setState({isSignup: true})

      if (!nextProps.currentUser || nextProps.currentUser.loading) {
        return
      }

      if (!nextProps.currentUser.CurrentUser || nextProps.currentUser.CurrentUser.activated) {
        nextProps.dispatch(push('/'))
      }
    }
  }

  submit = (e) => {
    e.preventDefault()
    let submitAction = this.props.login
    if(this.refs.isSignup.checked) {
      submitAction = this.props.signup
    }
    this.setState({ error: '' })

    submitAction({ username: this.refs.username.value, password: this.refs.password.value })
      .then(() => {
        this.redirectAfterLogin()
      })
      .catch((data) => {
        const error = data.graphQLErrors[0].message
        this.setState({ error })
      })
  }

  redirectAfterLogin = () => {
    this.props.dispatch(push('/'))
  }
  
  checkboxClick = () => {
    this.setState({isSignup: !this.state.isSignup})
  }

  render () {
    return (
      <FlexibleContentWrapper>
        <form className={'login-form'} onSubmit={this.submit}>
          <div className='text-error'>{ this.state.error }</div>
          <div>
            <label>Username:</label>
            <input ref='username' type='text' name='username'/>
          </div>
          <div>
            <label>Password:</label>
            <input ref='password' type='password' name='password'/>
          </div>
          <div>
            <input ref='isSignup' type="checkbox" name="newAccount" checked={this.state.isSignup}
                   onChange={this.checkboxClick}/>
            <label onClick={this.checkboxClick}>New account</label>
          </div>
          <div className={'login-form-buttons-container'}>
            <FBLoginButton onLogin={this.redirectAfterLogin}/>
            <input className={'login-button'} type='submit' value={this.getLoginButtonLabel(this.state.isSignup)}/>
          </div>
        </form>
      </FlexibleContentWrapper>
    )
  }
}
const logIn = gql`
    mutation logIn($username: String!, $password: String!){
        logIn(username: $username, password: $password) {
            _id, username, activated
        }
    }
`

const signup = gql`
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!){
        setUsernameAndPasswordForGuest(username: $username, password: $password) {
            username
        }
    }
`

export default compose(
  connect(),
  withRouter,
  graphql(logIn, {
    props: ({ownProps, mutate}) => ({
      login: ({username, password}) => mutate({
        variables: {
          username,
          password
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logIn
              }
            })
          }
        },
        refetchQueries: [{
          query: currentLessonQuery
        }]
      })
    })
  }),
  graphql(signup, {
    props: ({ownProps, mutate}) => ({
      signup: ({username, password}) => mutate({
        variables: {
          username,
          password
        },
        refetchQueries: [{
          query: currentUserQuery
        }]
      })
    })
  }),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Login)
