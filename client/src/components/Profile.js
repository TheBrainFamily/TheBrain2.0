// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'

import FlexibleContentWrapper from './FlexibleContentWrapper'

class Profile extends React.Component {
  state = {
    error: ''
  }

  submit = (e) => {
    e.preventDefault()
    this.setState({ error: '' })

    console.log('* LOG * submit', e)
  }

  comparePasswords = () => {
    console.log('* LOG * comparePasswords')
    if (this.refs.newPassword.value.length !== this.refs.newPasswordConfirmation.value.length) {
      return this.setState({ error: '' })
    }

    if (this.refs.newPassword.value !== this.refs.newPasswordConfirmation.value) {
      return this.setState({ error: 'Passwords don\'t match' })
    }
  }

  render () {
    return (
      <FlexibleContentWrapper offset={400}>
        <form className='form' onSubmit={this.submit}>
          {this.state.error &&
            <div className='text-error'>{ this.state.error }</div>
          }
          <div>
            <label>Old Password:</label>
            <input ref='oldPassword' type='password' name='oldPassword' />
          </div>
          <div>
            <label>New Password:</label>
            <input ref='newPassword' type='password' name='newPassword' />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input ref='newPasswordConfirmation' type='password' name='newPasswordConfirmation' onChange={this.comparePasswords} />
          </div>
          <div>
            <input type='submit' value='Change Password' />
          </div>
        </form>
      </FlexibleContentWrapper>
    )
  }
}

const changePasswordMutation = gql`
    mutation changePassword($oldPassword: String!, $newPassword: String!){
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }
`

export default compose(
  connect(),
  graphql(changePasswordMutation, {
    props: ({ mutate }) => ({
      submit: ({ oldPassword, newPassword }) => mutate({
        variables: {
          oldPassword,
          newPassword
        }
      })
    })
  }),
)(Profile)
