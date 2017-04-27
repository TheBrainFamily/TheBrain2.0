// @flow

import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'

class ResetPassword extends React.Component {
  submit = (e) => {
    e.preventDefault()
    this.props.submit({ username: this.refs.username.value })
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <div>
          <label>Username:</label>
          <input ref="username" type="text" name="username" />
        </div>
        <div>
          <input type="submit" value="Reset Password" />
        </div>
      </form>)
  }
}

const resetPassword = gql`
    mutation resetPassword($username: String!){
        resetPassword(username: $username) {
            success
        }
    }
`

export default withRouter(graphql(resetPassword, {
  props: ({ ownProps, mutate }) => ({
    submit: ({ username }) => mutate({
      variables: {
        username
      }
    })
  })
})(ResetPassword))
