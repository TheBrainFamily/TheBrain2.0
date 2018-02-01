import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo/'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import update from 'immutability-helper/index'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import { getGraphqlForSignup } from 'thebrain-shared/graphql/mutations/setUsernameAndPasswordForGuest'

const logIn = gql`
    mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean){
        logIn(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export const loginWrapper = compose(
  connect(),
  withRouter,
  graphql(logIn, {
    props: ({ownProps, mutate}) => ({
      login: ({username, password, deviceId, saveToken}) => mutate({
        variables: {
          username,
          password,
          deviceId,
          saveToken
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
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
  getGraphqlForSignup(graphql),
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
)
