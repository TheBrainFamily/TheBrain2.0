import React from 'react'
import { Text, TouchableOpacity, View, Switch, AsyncStorage } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import * as courseActions from '../actions/CourseActions'
import PageContainer from './PageContainer'
import FBLoginButton from './FBLoginButton'

import styles from '../styles/styles'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'
import userDetailsQuery from '../../client/shared/graphql/queries/userDetails'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLogin: true,
      error: '',
      username: '',
      password: '',
      waitingForRefetch: false
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

    // console.log('this.state.waitingForRefetch', this.state.waitingForRefetch)
    // console.log('nextProps.userDetails', nextProps.userDetails)
    // console.log('loading?', nextProps.userDetails.loading)
    // console.log('############')
    // console.log('this.props.userDetails', this.props.userDetails)
    // console.log('this.props.loading?', this.props.userDetails.loading)
    if(!this.state.waitingForRefetch && nextProps.userDetails && nextProps.userDetails.UserDetails) {
      if (nextProps.currentUser.CurrentUser && nextProps.currentUser.CurrentUser.activated) {
        console.log('going to /')
        nextProps.history.push('/')
      }
    }
  }

  toggleSwitch = () => {
    this.setState({ isLogin: !this.state.isLogin })
  }

  submit = () => {
    this.setState({ error: '' })
    const actionName = this.state.isLogin ? 'login' : 'signup'
    console.log('>>>>>>> USER', actionName)
    this.setState({waitingForRefetch: true}, () => {
      this.props[actionName]({ username: this.state.username, password: this.state.password })
        .then( async () => {
          this.props.dispatch(courseActions.close())
          const accessToken = this.props.currentUser.CurrentUser.currentAccessToken
          const userId = this.props.currentUser.CurrentUser._id
          await AsyncStorage.setItem('accessToken', accessToken)
          await AsyncStorage.setItem('userId', userId)
          console.log('LOGIN THIS', this)
          await this.props.userDetails.refetch()
          console.log('this.props.userDetails', this.props.userDetails)
          console.log('going to / after refetch')
          this.props.history.push('/')
        })
        .catch((data) => {
          const error = data.graphQLErrors[0].message
          this.setState({ error })
        })
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
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!) {
        setUsernameAndPasswordForGuest(username: $username, password: $password) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

const logIn = gql`
    mutation logIn($username: String!, $password: String!){
        logIn(username: $username, password: $password) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export default compose(
  connect(),
  graphql(signup, {
    props: ({ ownProps, mutate }) => ({
      signup: ({ username, password }) => mutate({
        variables: {
          username,
          password
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult vhjhgjg', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.setUsernameAndPasswordForGuest
              }
            })
          }
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(logIn, {
    props: ({ ownProps, mutate }) => ({
      login: ({ username, password }) => mutate({
        variables: {
          username,
          password
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
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
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
)(Login)
