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
    error: '',
    isValid: false
  }

  submit = (e) => {
    e.preventDefault()
    swal("Good job!", "Password changed successfully", "success")
    // this.setState({ error: '' })
    // this.props.submit({ oldPassword: this.refs.oldPassword.value, newPassword: this.refs.newPassword.value })
    //   .then(() => {
    //       this.props.dispatch(push('/')
    //   })
    //   .catch((data) => {
    //     // const error = data.graphQLErrors[0].message
    //     const error = "Byle jaki tekst"
    //     this.setState({ error })
    //   })
  }

  comparePasswords = () => {
    if (this.refs.newPassword.value.length !== this.refs.newPasswordConfirmation.value.length) {
      return this.setState({ error: '', isValid: false })
    }
    if (this.refs.newPassword.value !== this.refs.newPasswordConfirmation.value) {
      return this.setState({ error: 'Passwords don\'t match', isValid: false })
    }
    if (this.refs.newPasswordConfirmation.value.length > 3) {
      return this.setState({ isValid: true })
    }

  }

  render () {
    return (
      <FlexibleContentWrapper offset={400}>
        <form className='form' onSubmit={this.submit}>
          <div className={!this.state.error ? 'hidden' : null}>
            <p className='alert-error'>{ this.state.error }</p>
          </div>
          <div>
            <label>Old Password:</label>
            <input ref='oldPassword' type='password' name='oldPassword'/>
          </div>
          <div>
            <label>New Password:</label>
            <input ref='newPassword' type='password' name='newPassword' onChange={this.comparePasswords}/>
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input className={!!this.state.error ? 'error' : null} ref='newPasswordConfirmation' type='password'
                   name='newPasswordConfirmation'
                   onChange={this.comparePasswords}/>
          </div>
          <div>
            <input type='submit' value='Change Password' disabled={!this.state.isValid || !!this.state.error}/>
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
    refs: ({ mutate }) => ({
      submit: ({ oldPassword, newPassword }) => mutate({
        variables: {
          oldPassword,
          newPassword
        }
      })
    })
  }),
)(Profile)
