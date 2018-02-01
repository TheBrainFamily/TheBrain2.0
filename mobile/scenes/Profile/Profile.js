import _ from 'lodash'
import React from 'react'
import { Text, TouchableOpacity, Switch, View, Alert } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { TextField } from 'react-native-material-textfield'

import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import Separator from '../../components/Separator'

import styles from '../../styles/styles'
import changePasswordMutation from 'thebrain-shared/graphql/queries/changePasswordMutation'
import { getGraphqlForSwitchUserIsCasual } from 'thebrain-shared/graphql/mutations/switchUserIsCasual'
import getPasswordValidationState from 'thebrain-shared/helpers/getPasswordValidationState'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import WithData from '../../components/WithData'

class Profile extends React.Component {
  state = {
    oldPasswordError: '',
    confirmationError: '',
    isValid: false,
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
    isCasual: false
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
            'There was a problem while changing your password'
          )
        }
      })
      .catch((data) => {
        const oldPasswordError = data.graphQLErrors[0].message
        this.setState({ oldPasswordError })
        this.props.history.push('/nointernet')
      })
  }

  onChangeText = (field) => (value) => {
    this.setState({ [field]: value }, this.validatePasswords)
  }

  validatePasswords = () => {
    const { oldPassword, newPassword, newPasswordConfirmation } = this.state
    this.setState(getPasswordValidationState({ oldPassword, newPassword, newPasswordConfirmation }))
  }

  focusNextField (key) {
    this.inputs[key].focus()
  }

  casualSwitchAction = () => {
    this.props.switchUserIsCasual()
    this.setState({isCasual: !this.state.isCasual})
  }

  componentWillUpdate = (nextProps) => {
    if (nextProps.userDetails.loading === false && !!nextProps.userDetails.UserDetails.isCasual !== this.state.isCasual) {
      this.setState({isCasual: !!nextProps.userDetails.UserDetails.isCasual})
    }
  }

  render () {
    const { isValid } = this.state
    const isGuest = this.props.currentUser && this.props.currentUser.CurrentUser ? !this.props.currentUser.CurrentUser.activated : true
    const isFacebookUser = this.props.currentUser && this.props.currentUser.CurrentUser ? this.props.currentUser.CurrentUser.facebookId : false

    return (
      <PageContainer>
        <PageTitle text='PROFILE' />

        <View style={{
          paddingHorizontal: '10%'
        }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <Text>Hide hard questions</Text>
            <Switch onValueChange={this.casualSwitchAction} value={this.state.isCasual} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 10, marginTop: 18}}>
          <Separator />
        </View>

        { isGuest || isFacebookUser ? null : <View style={{
          paddingHorizontal: '10%'
        }}>
          <TextField
            onSubmitEditing={() => {
              this.focusNextField('newPassword')
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
            ref={input => {
              this.inputs['newPassword'] = input
            }}
            onSubmitEditing={() => {
              this.focusNextField('newPasswordConfirmation')
            }}
            autoCapitalize='none'
            secureTextEntry
            label='New Password'
            value={this.state.newPassword}
            onChangeText={this.onChangeText('newPassword')}
          />
          <TextField
            ref={input => {
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
        </View> }
      </PageContainer>
    )
  }
}

export default compose(
  connect(),
  withRouter,
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
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  getGraphqlForSwitchUserIsCasual(graphql)
)(WithData(Profile, ['userDetails', 'currentUser']))
