// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import currentLessonQuery from '../../shared/graphql/queries/currentLesson'

class Login extends React.Component {
  state = {
    error: ''
  }

  submit = (e) => {
    e.preventDefault()
    this.setState({ error: '' })

    this.props.submit({ username: this.refs.username.value, password: this.refs.password.value })
      .then(() => {
        this.props.dispatch(push('/'))
      })
      .catch((data) => {
        const error = data.graphQLErrors[0].message
        this.setState({ error })
      })
  }

  render () {
    return (
      <form onSubmit={this.submit}>
        {this.state.error &&
          <div className='text-error'>{ this.state.error }</div>
        }
        <div>
          <label>Username:</label>
          <input ref='username' type='text' name='username' />
        </div>
        <div>
          <label>Password:</label>
          <input ref='password' type='password' name='password' />
        </div>
        <div>
          <input type='submit' value='Log In' />
        </div>
      </form>)
  }
}
const logIn = gql`
    mutation logIn($username: String!, $password: String!){
        logIn(username: $username, password: $password) {
            _id, username, activated
        }
    }
`

export default compose(
  connect(),
  withRouter,
  graphql(logIn, {
    props: ({ ownProps, mutate }) => ({
      submit: ({ username, password }) => mutate({
        variables: {
          username,
          password
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
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
  })
)(Login)
