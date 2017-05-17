import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Header from './Header'
import FBLoginButton from './FBLoginButton'

import styles from '../styles/styles'

import currentUserQuery from './../queries/currentUser'

class Signup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: 'test',
      password: 'test',
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentUser.loading) {
      return
    }

    if (!nextProps.currentUser.CurrentUser || nextProps.currentUser.CurrentUser.activated) {
      // nextProps.dispatch(push('/'))
      console.log('going to /')
      nextProps.history.push('/')
    }
  }

  // componentDidUpdate () {
  //   if (this.props.currentUser.loading) {
  //     return
  //   }
  //
  //   if (!this.props.currentUser.CurrentUser || this.props.currentUser.CurrentUser.activated) {
  //     // this.props.dispatch(push('/'))
  //     console.log('going to /')
  //     this.props.history.push('/')
  //   }
  // }

  componentWillMount() {
    console.log('* LOG * componentWillMount')
  }

  componentWillUnmount() {
    console.log('* LOG * componentWillUnmount')
  }

  // componentDidUpdate = () => {
  //   if (!this.props.currentUser.loading) {
  //     if (this.props.currentUser.CurrentUser &&
  //       this.props.currentUser.CurrentUser.activated) {
  //       console.log('going to /')
  //       this.props.history.push('/')
  //     }
  //   }
  // }

  submit = () => {
    console.log('* LOG * signup this.state', this.state)
    this.props.signup({ username: this.state.username, password: this.state.password })
      .then(() => {
        console.log('* LOG * success sign up')
        this.props.history.push('/')
      })
  }

  render () {
    if (this.props.currentUser.loading) {
      return <Text>Loading...</Text>
    }

    return (
      <View>
        <Header />

        <View style={{ alignItems: 'center' }}>
          <View style={[styles.form]}>
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
              <Text style={[styles.button, { backgroundColor: 'steelblue' }]}>Sign up</Text>
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
  graphql(currentUserQuery, { name: 'currentUser' }),
)(Signup)
