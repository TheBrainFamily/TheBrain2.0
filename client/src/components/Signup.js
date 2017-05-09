import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import currentUserQuery from 'queries/currentUser'

class Signup extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.currentUser.CurrentUser) {
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
      </form>)
  };
}

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
  graphql(currentUserQuery, { name: 'currentUser' })
)(Signup)
