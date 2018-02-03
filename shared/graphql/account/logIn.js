import gql from 'graphql-tag'
import update from 'immutability-helper'

const logIn = gql`
    mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean){
        logIn(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export const getGraphqlForLogin = (graphql) => {
  return graphql(logIn, {
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
  })
}
