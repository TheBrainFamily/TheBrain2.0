import React from 'react'
import { Text, TouchableOpacity, View, Switch, AsyncStorage } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import DeviceInfo from 'react-native-device-info'
import * as courseActions from '../actions/CourseActions'
import PageContainer from './PageContainer'
import FBLoginButton from './FBLoginButton'

import styles from '../styles/styles'

import currentUserQuery from '../shared/graphql/queries/currentUser'
import userDetailsQuery from '../shared/graphql/queries/userDetails'
import WithData from './WithData'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLogin: true,
      error: '',
      username: '',
      password: ''
    }

    this.inputs = {}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentUser.loading) {
      return
    }

    if (nextProps.match.path === '/signup') {
      this.setState({isLogin: false})
    }
  }

  toggleSwitch = () => {
    this.setState({ isLogin: !this.state.isLogin })
  }

  submit = () => {
    const deviceId = DeviceInfo.getUniqueID() || 'defaultMobileClient'
    this.setState({ error: '' })
    const actionName = this.state.isLogin ? 'login' : 'signup'
    this.props[actionName]({ username: this.state.username, password: this.state.password, deviceId, saveToken: true })
      .then( async () => {
        this.props.dispatch(courseActions.close())
        const accessToken = this.props.currentUser.CurrentUser.currentAccessToken
        const userId = this.props.currentUser.CurrentUser._id
        await AsyncStorage.setItem('accessToken', accessToken)
        await AsyncStorage.setItem('userId', userId)
        await this.props.userDetails.refetch()
        this.props.history.push('/')
      })
      .catch((data) => {
        this.history.push('/nointernet')
        const error = data.graphQLErrors[0].message
        this.setState({ error })
      })
  }

  focusNextField (key) {
    this.inputs[key].focus()
  }

  render () {
    return (
      <PageContainer>

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: 20, marginVertical: 20 }]}>
            {this.state.isLogin ? 'Sign in' : 'Sign up' } and stay educated
          </Text>

          <View style={{ alignItems: 'center' }}>
            <FBLoginButton />
          </View>

          <Text style={[styles.infoText, { fontWeight: 'bold', color: '#ccc', fontSize: 12, marginTop: 15 }]}>OR</Text>

          <View style={styles.form}>
            {this.state.error
              ? <Text style={styles.errorText}>{ this.state.error }</Text>
              : <Text />
            }

            <TextField
              underlineColorAndroid='transparent'
              onSubmitEditing={() => {
                this.focusNextField('password')
              }}
              autoFocus
              autoCapitalize='none'
              autoCorrect={false}
              label='Username'
              onChangeText={(username) => this.setState({ username })}
              value={this.state.username}
            />

            <TextField
              underlineColorAndroid='transparent'
              ref={ input => {
                this.inputs['password'] = input
              }}
              secureTextEntry
              autoCapitalize='none'
              autoCorrect={false}
              label='Password'
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <Text>New account?</Text>
              <Switch onValueChange={this.toggleSwitch} value={!this.state.isLogin}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.submit}>
              <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 20 }]}>
                {this.state.isLogin ? 'LOGIN' : 'SIGNUP'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </PageContainer>
    )
  }
}

const signup = gql`
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean) {
        setUsernameAndPasswordForGuest(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

const logIn = gql`
    mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean){
        logIn(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export default compose(
  connect(),
  graphql(signup, {
    props: ({ ownProps, mutate }) => ({
      signup: ({ username, password, deviceId, saveToken }) => mutate({
        variables: {
          username,
          password,
          deviceId,
          saveToken
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.setUsernameAndPasswordForGuest
              }
            })
          }
        }
      })
    })
  }),
  graphql(logIn, {
    props: ({ ownProps, mutate }) => ({
      login: ({ username, password, deviceId, saveToken }) => mutate({
        variables: {
          username,
          password,
          deviceId,
          saveToken
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logIn
              }
            })
          }
        }
      })
    })
  }),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(WithData(Login, ['currentUser', 'userDetails']))
