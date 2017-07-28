import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import PageContainer from './PageContainer'
import FBLoginButton from './FBLoginButton'
import Loading from './Loading'

import styles from '../styles/styles'

import currentUserQuery from './../queries/currentUser'

class Signup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
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

    if (!nextProps.currentUser.CurrentUser || nextProps.currentUser.CurrentUser.activated) {
      console.log('going to /')
      nextProps.history.push('/')
    }
  }

  submit = () => {
    this.setState({ error: '' })

    this.props.signup({ username: this.state.username, password: this.state.password })
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
    if (this.props.currentUser.loading) {
      return <Loading />
    }

    return (
      <PageContainer>

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: 20, marginVertical: 30 }]}>Sign up and stay educated</Text>

          <View style={{ alignItems: 'center' }}>
            <FBLoginButton />
          </View>

          <Text style={[styles.infoText, { fontWeight: 'bold', color: '#ccc', fontSize: 12, marginTop: 30 }]}>OR</Text>

          <View style={[styles.form]}>
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
              <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 5 }]}>SIGN UP</Text>
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
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Signup)
