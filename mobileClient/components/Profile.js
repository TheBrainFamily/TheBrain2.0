import _ from 'lodash'
import React from 'react'
import { Text, TouchableOpacity, View, Alert } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { TextField } from 'react-native-material-textfield'

import Header from './Header'
import PageTitle from './PageTitle'

import styles from '../styles/styles'
import changePasswordMutation from '../../client/shared/graphql/queries/changePasswordMutation'
import getPasswordValidationState from '../../client/shared/helpers/getPasswordValidationState'

class Profile extends React.Component {
  state = {
    oldPasswordError: '',
    confirmationError: '',
    isValid: false,
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  }

  inputs = {}

  goHome = () => {
    this.props.history.push('/')
  }

  submit = () => {
    this.props.submit({ oldPassword: this.state.oldPassword, newPassword: this.state.newPassword })
      .then((response) => {
        if (_.get(response, 'data.changePassword.success')) {
          Alert.alert(
            'Good job!',
            'Password changed successfully',
            [{ text: 'OK', onPress: this.goHome }],
            { cancelable: false }
          )
        } else {
          Alert.alert(
            'Oops...',
            'There was a problem while changing your password',
          )
        }
      })
      .catch((data) => {
        const oldPasswordError = data.graphQLErrors[0].message
        this.setState({ oldPasswordError })
      })
  }

  onChangeText = (field) => (value) => {
    this.setState({ [field]: value }, this.validatePasswords)
  }

  validatePasswords = () => {
    const { oldPassword, newPassword, newPasswordConfirmation } = this.state
    this.setState(getPasswordValidationState({ oldPassword, newPassword, newPasswordConfirmation }))
  }

  focusNextField(key) {
    this.inputs[key].focus();
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
            onSubmitEditing={() => {
              this.focusNextField('newPassword');
            }}
            autoFocus
            autoCapitalize='none'
            secureTextEntry
            label='Old Password'
            value={this.state.oldPassword}
            onChangeText={this.onChangeText('oldPassword')}
            error={this.state.oldPasswordError}
          />
          <TextField
            ref={ input => {
              this.inputs['newPassword'] = input
            }}
            onSubmitEditing={() => {
              this.focusNextField('newPasswordConfirmation');
            }}
            autoCapitalize='none'
            secureTextEntry
            label='New Password'
            value={this.state.newPassword}
            onChangeText={this.onChangeText('newPassword')}
          />
          <TextField
            ref={ input => {
              this.inputs['newPasswordConfirmation'] = input
            }}
            autoCapitalize='none'
            secureTextEntry
            label='Confirm New Password'
            value={this.state.newPasswordConfirmation}
            onChangeText={this.onChangeText('newPasswordConfirmation')}
            error={this.state.confirmationError}
          />

          <TouchableOpacity onPress={this.submit} activeOpacity={0.8} disabled={!isValid}>
            <Text style={[
              styles.button,
              { backgroundColor: '#68b888', marginTop: 5 },
              !isValid ? { opacity: 0.7 } : {}
            ]}>CHANGE PASSWORD</Text>
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
