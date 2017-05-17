import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'

import Header from './Header'
import FBLoginButton from './FBLoginButton'

import styles from '../styles/styles'

// import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: '',
      username: 'test',
      password: 'test',
    }
  }

  submit = () => {
    this.setState({ error: '' })

    console.log('* LOG * login this.state', this.state)
    this.props.login({ username: this.state.username, password: this.state.password })
      .then(() => {
        console.log('* LOG * success log in')
        this.props.history.push('/')
      })
      .catch((data) => {
        const error = data.graphQLErrors[0].message
        this.setState({ error })
      })

  }

  render () {
    return (
      <View>
        <Header />

        <View style={{ alignItems: 'center' }}>
          <View style={styles.form}>
            {this.state.error ?
              <Text style={styles.errorText}>{ this.state.error }</Text>
              :
              <Text />
            }

            <TextInput
              style={styles.textInput}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Username"
              onChangeText={(username) => this.setState({ username })}
              value={this.state.username}
            />

            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Password"
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />

            <TouchableOpacity onPress={this.submit}>
              <Text style={[styles.button, { backgroundColor: 'steelblue' }]}>Log in</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <FBLoginButton />
            </View>
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
        // refetchQueries: [{
        //   query: currentLessonQuery
        // }]
      })
    })
  })
)(Login)
