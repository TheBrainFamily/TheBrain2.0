import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Link } from 'react-router-native'
import { connect } from 'react-redux'
import { withApollo, compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'

import Lecture from './Lecture'

import styles from '../styles/styles'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'
// import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Home extends React.Component {
  logout = () => {
    console.log('* LOG * Home logout')
    this.props.logout()
      .then(() => {
          this.props.client.resetStore()
        })
  }

  render () {
    if (this.props.data.loading) {
      return <View/>
    }

    const currentUser = this.props.data.CurrentUser
    const activated = currentUser && currentUser.activated

    console.log('* LOG * this.props', this.props)

    return (
      <View>
        {activated ?
          <View style={{ margin: 10 }}>
            {/*<Link to="/logout" onClick={this.logout}>*/}
            <TouchableOpacity onPress={this.logout}>
              <Text style={styles.button}>Logout</Text>
            </TouchableOpacity>
            {/*<Link to="/logout">*/}
              {/*<Text style={styles.button}>Logout</Text>*/}
            {/*</Link>*/}
          </View>
          :
          <View style={{ margin: 10 }}>
            <Link to="/login">
              <Text style={styles.button}>Login</Text>
            </Link>
            {/*<Link to="/signup">*/}
              {/*<Text style={styles.button}>Signup</Text>*/}
            {/*</Link>*/}
          </View>
        }

        <Lecture />
      </View>
    )
  }
}

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id, username, activated
        }
    }
`

export default compose(
  connect(),
  withApollo,
  graphql(logOutQuery, {
    props: ({ ownProps, mutate }) => ({
      logout: () => mutate({
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logOut
              }
            })
          }
        },
        // refetchQueries: [{
        //   query: currentLessonQuery
        // }]
      })
    })
  }),
  graphql(currentUserQuery)
)(Home)
