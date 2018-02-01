import gql from 'graphql-tag'
import update from 'immutability-helper'

const signup = gql`
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean){
        setUsernameAndPasswordForGuest(username: $username, password: $password, deviceId: $deviceId, saveToken: $saveToken) {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export const getGraphqlForSignup = (graphql) => {
  return graphql(signup, {
    props: ({ownProps, mutate}) => ({
      signup: ({username, password, deviceId, saveToken}) => mutate({
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
                $set: mutationResult.data.setUsernameAndPasswordForGuest
              }
            })
          }
        }
      })
    })
  })
}
