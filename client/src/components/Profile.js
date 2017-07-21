// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import swal from 'sweetalert2'

import 'sweetalert2/dist/sweetalert2.min.css'

import FlexibleContentWrapper from './FlexibleContentWrapper'

class Profile extends React.Component {
  state = {
    oldPasswordError: '',
    confirmationError: '',
    isValid: false
  }

  goHome = () => {
    this.props.dispatch(push('/'))
  }

  submit = (e) => {
    e.preventDefault()
    this.props.submit({ oldPassword: this.refs.oldPassword.value, newPassword: this.refs.newPassword.value })
      .then(() => {
        swal("Good job!", "Password changed successfully", "success").then(this.goHome, this.goHome)
      })
      .catch((data) => {
        const oldPasswordError = data.graphQLErrors[0].message
        this.setState({ oldPasswordError })
      })
  }

  validatePasswords = () => {
    if (!this.refs.oldPassword.value.length) {
      this.setState({ oldPasswordError: 'Password cannot be empty', isValid: false })
    } else {
      this.setState({ oldPasswordError: '' })
    }

    if (this.refs.newPassword.value.length !== this.refs.newPasswordConfirmation.value.length) {
      return this.setState({ confirmationError: '', isValid: false })
    }
    if (this.refs.newPassword.value !== this.refs.newPasswordConfirmation.value) {
      return this.setState({ confirmationError: 'Passwords don\'t match', isValid: false })
    }
    if (this.refs.newPasswordConfirmation.value.length > 3) {
      return this.setState({ isValid: true })
    }

  }

  render () {
    const error = this.state.oldPasswordError || this.state.confirmationError

    return (
      <FlexibleContentWrapper offset={400}>
        <form className='form' onSubmit={this.submit}>
          <div className={!error ? 'hidden' : null}>
            <p className='alert-error'>{ error }</p>
          </div>
          <div>
            <label>Old Password:</label>
            <input className={!!this.state.oldPasswordError ? 'error' : null} ref='oldPassword'
                   type='password'
                   name='oldPassword'
                   onChange={this.validatePasswords}
            />
          </div>
          <div>
            <label>New Password:</label>
            <input ref='newPassword' type='password' name='newPassword' onChange={this.validatePasswords}/>
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input className={!!this.state.confirmationError ? 'error' : null} ref='newPasswordConfirmation'
                   type='password'
                   name='newPasswordConfirmation'
                   onChange={this.validatePasswords}
            />
          </div>
          <div>
            <input type='submit' value='Change Password' disabled={!this.state.isValid || !!error}/>
          </div>
        </form>
      </FlexibleContentWrapper>
    )
  }
}

const changePasswordMutation = gql`
    mutation changePassword($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
          success
        }
    }
`

export default compose(
  connect(state => state),
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
