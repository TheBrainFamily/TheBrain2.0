import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { TextField } from 'react-native-material-textfield'

import Header from './Header'
import PageTitle from './PageTitle'

import styles from '../styles/styles'
import changePasswordMutation from '../../client/shared/graphql/queries/changePasswordMutation'

class Profile extends React.Component {
  state = {
    oldPasswordError: '',
    confirmationError: '',
    isValid: false,
    oldPassword: '1111',
    newPassword: '1111',
    newPasswordConfirmation: '1111'
  }

  goHome = () => {
    this.props.history.push('/')
  }

  submit = () => {
    console.log('* LOG * this.state.oldPassword', this.state.oldPassword)
    console.log('* LOG * this.state.newPassword', this.state.newPassword)
    this.props.submit({ oldPassword: this.state.oldPassword, newPassword: this.state.newPassword })
      .then(function() {
        // console.log('* LOG * this.props', this.props)
        console.log('* LOG * Password changed successfully', arguments)
      })
      .catch((data) => {
        const oldPasswordError = data.graphQLErrors[0].message
        this.setState({ oldPasswordError })
      })
  }

  onChangeText = (field) => (value) => {
    console.log('* LOG * field, value', field, value)
    this.setState({ [field]: value }, this.validatePasswords)
  }

  validatePasswords = () => {
    console.log('* LOG * this.state.oldPassword.length', this.state.oldPassword.length)
    if (!this.state.oldPassword.length) {
      this.setState({ oldPasswordError: 'Password cannot be empty', isValid: false })
    } else {
      this.setState({ oldPasswordError: '' })
    }

    if (this.state.newPassword.length !== this.state.newPasswordConfirmation.length) {
      return this.setState({ confirmationError: '', isValid: false })
    }
    if (this.state.newPassword!== this.state.newPasswordConfirmation) {
      return this.setState({ confirmationError: 'Passwords don\'t match', isValid: false })
    }
    if (this.state.newPasswordConfirmation.length > 3) {
      return this.setState({ isValid: true })
    }
  }

  render () {
    const { isValid } = this.state

    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />
        <PageTitle text='PROFILE' />

        <View style={{
          paddingHorizontal: '10%'
        }}>
          <TextField
            // style={styles.textInput}
            autoFocus
            autoCapitalize='none'
            secureTextEntry
            label='Old Password'
            value={this.state.oldPassword}
            onChangeText={this.onChangeText('oldPassword')}
            error={this.state.oldPasswordError}
            // ref={component => this.oldPassword = component}
            // ref='oldPassword'
            // value={this.state.username}
          />
          <TextField
            // style={styles.textInput}
            autoCapitalize='none'
            secureTextEntry
            label='New Password'
            value={this.state.newPassword}
            onChangeText={this.onChangeText('newPassword')}
            // ref='newPassword'
            // value={this.state.username}
          />
          <TextField
            // style={styles.textInput}
            autoCapitalize='none'
            secureTextEntry
            label='Confirm New Password'
            value={this.state.newPasswordConfirmation}
            onChangeText={this.onChangeText('newPasswordConfirmation')}
            error={this.state.confirmationError}
            // ref='newPasswordConfirmation'
            // value={this.state.username}
          />

          <TouchableOpacity onPress={this.submit} activeOpacity={0.8} disabled={!isValid}>
            <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 5 }, !isValid ? { opacity: 0.7 } : {}]}>CHANGE PASSWORD</Text>
          </TouchableOpacity>
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
