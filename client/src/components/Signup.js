// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import FBLoginButton from './FBLoginButton'

import currentUserQuery from '../../shared/graphql/queries/currentUser'

class Signup extends React.Component {
  state = {
    error: '',
  }

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
    if (this.props.currentUser.loading) {
      return <div>Loading...</div>
    }

    return (
      <form onSubmit={this.submit}>
        {this.state.error &&
          <div className="text-error">{ this.state.error }</div>
        }
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

        <FBLoginButton />
      </form>
    )
  }
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
)(Signup)
