import gql from 'graphql-tag'
import update from 'immutability-helper'
import userDetailsQuery from '../userDetails/userDetails'

const logInWithTokenMutation = gql`
    mutation logInWithToken($accessToken: String!, $userId: String!, $deviceId: String!) {
        logInWithToken(accessToken:$accessToken, userId:$userId, deviceId:$deviceId) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`

export const getGraphqlForLogInWithTokenMutation = (graphql) => {
  return graphql(logInWithTokenMutation, {
    props: ({ ownProps, mutate }) => ({
      logInWithToken: ({ accessToken, userId, deviceId }) => mutate({
        variables: {
          accessToken,
          userId,
          deviceId
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithToken
              }
            })
          }
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  })
}
