import React from 'react'
import { Text, TextInput, TouchableOpacity, View, Switch } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'

import PageContainer from './PageContainer'
import FBLoginButton from './FBLoginButton'

import styles from '../styles/styles'

import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'
import currentUserQuery from './../queries/currentUser'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isLogin: false,
      error: '',
      username: '',
      password: ''
    }

    this.inputs = {}
  }

  toggleSwitch = () => {
    this.setState({isLogin: !this.state.isLogin})
  }

  submit = () => {
    this.setState({error: ''})
    if (this.state.isLogin) {
      this.props.login({username: this.state.username, password: this.state.password})
        .then(() => {
          this.props.history.push('/')
        })
        .catch((data) => {
          const error = data.graphQLErrors[0].message
          this.setState({error})
        })
    } else {
      this.props.signup({username: this.state.username, password: this.state.password})
        .then(() => {
          this.props.history.push('/')
        })
        .catch((data) => {
          const error = data.graphQLErrors[0].message
          this.setState({error})
        })
    }
  }

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render () {
    return (
      <PageContainer>

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: 20, marginVertical: 20 }]}>Sign in and stay educated</Text>

          <View style={{ alignItems: 'center'}}>
            <FBLoginButton />
          </View>

          <Text style={[styles.infoText, { fontWeight: 'bold', color: '#ccc', fontSize: 12, marginTop: 15 }]}>OR</Text>

          <View style={styles.form}>
            {this.state.error
              ? <Text style={styles.errorText}>{ this.state.error }</Text>
              : <Text />
            }

            <View style={styles.textInputWrapper}>
              <TextInput
                onSubmitEditing={() => {
                  this.focusNextField('password');
                }}
                style={styles.textInput}
                autoFocus
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='Username'
                onChangeText={(username) => this.setState({ username })}
                value={this.state.username}
              />
            </View>

            <View style={styles.textInputWrapper}>
              <TextInput
                ref={ input => {
                  this.inputs['password'] = input
                }}
                style={styles.textInput}
                secureTextEntry
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='Password'
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              />
            </View>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <Text>New account?</Text>
              <Switch onValueChange={this.toggleSwitch} value={!this.state.isLogin} />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.submit}>
              <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 20 }]}>{this.state.isLogin ? 'LOGIN' : 'SIGNUP'}</Text>
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
            username
        }
    }
`

const logIn = gql`
    mutation logIn($username: String!, $password: String!){
        logIn(username: $username, password: $password) {
            _id, username, activated
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
        refetchQueries: [{
          query: currentUserQuery
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
        }
      })
    })
  })
)(Login)
