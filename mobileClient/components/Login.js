import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'

import Header from './Header'
import FBLoginButton from './FBLoginButton'

import styles from '../styles/styles'

import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: '',
      username: '',
      password: ''
    }

    this.inputs = {}
  }

  submit = () => {
    this.setState({ error: '' })

    this.props.login({ username: this.state.username, password: this.state.password })
      .then(() => {
        this.props.history.push('/')
      })
      .catch((data) => {
        const error = data.graphQLErrors[0].message
        this.setState({ error })
      })
  }

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render () {
    return (
      <View style={{ backgroundColor: 'white', height: '100%' }}>
        <Header />

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: 20, marginVertical: 30 }]}>Sign in and stay educated</Text>

          <View style={{ alignItems: 'center' }}>
            <FBLoginButton />
          </View>

          <Text style={[styles.infoText, { fontWeight: 'bold', color: '#ccc', fontSize: 12, marginTop: 30 }]}>OR</Text>

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

            <TouchableOpacity onPress={this.submit}>
              <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 5 }]}>LOGIN</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    )
  }
}

const logIn = gql`
    mutation logIn($username: String!, $password: String!){
        logIn(username: $username, password: $password) {
            _id, username, activated
        }
    }
`

export default compose(
  connect(),
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
          query: currentLessonQuery
        }]
      })
    })
  })
)(Login)
