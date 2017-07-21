import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'

import Header from './Header'
import PageTitle from './PageTitle'

import styles from '../styles/styles'
import changePasswordMutation from '../../client/shared/graphql/queries/changePasswordMutation'

class Profile extends React.Component {
  state = {
    oldPasswordError: '',
    confirmationError: '',
    isValid: false
  }

  goHome = () => {
    this.props.history.push('/')
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
    console.log("WILK: this.refs",this.refs);
    console.log("WILK: this.oldPassword",this.oldPassword);
    console.log("WILK: this.oldPassword.value",this.oldPassword.value);
    console.log("WILK: this.oldPassword.getText",this.oldPassword._getText());
    console.log("WILK: this.oldPassword.lastNativeText",this.oldPassword._lastNativeText);
    // console.log("WILK: this.refs.oldPassword", this.refs.oldPassword.value);
    // console.log("WILK: this.refs.newPassword", this.refs.newPassword.value);
    // console.log("WILK: this.refs.newPasswordConfirmation", this.refs.newPasswordConfirmation.value);
    // if (!this.refs.oldPassword.value.length) {
    //   this.setState({ oldPasswordError: 'Password cannot be empty', isValid: false })
    // } else {
    //   this.setState({ oldPasswordError: '' })
    // }
    //
    // if (this.refs.newPassword.value.length !== this.refs.newPasswordConfirmation.value.length) {
    //   return this.setState({ confirmationError: '', isValid: false })
    // }
    // if (this.refs.newPassword.value !== this.refs.newPasswordConfirmation.value) {
    //   return this.setState({ confirmationError: 'Passwords don\'t match', isValid: false })
    // }
    // if (this.refs.newPasswordConfirmation.value.length > 3) {
    //   return this.setState({ isValid: true })
  }

  render () {
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />
        <PageTitle text='PROFILE' />
        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textInput}
            autoFocus
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Old Password'
            onChangeText={this.validatePasswords}
            ref={component => this.oldPassword = component}
            // ref='oldPassword'
            // value={this.state.username}
          />
        </View>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textInput}
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='New Password'
            onChangeText={this.validatePasswords}
            ref='newPassword'
            // value={this.state.username}
          />
        </View>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textInput}
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Confirm New Password'
            onChangeText={this.validatePasswords}
            ref='newPasswordConfirmation'
            // value={this.state.username}
          />
        </View>
      </View>
    )
  }
}

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
