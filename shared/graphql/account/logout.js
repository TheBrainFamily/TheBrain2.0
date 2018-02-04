import gql from 'graphql-tag'
import update from 'immutability-helper'

const logoutMutation = gql`
    mutation logOut {
        logOut {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export const getGraphqlForLogout = (graphql) => {
  return graphql(logoutMutation, {
    props: ({ownProps, mutate}) => ({
      logout: () => mutate({
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logOut
              }
            })
          }
        }
      })
    })
  })
}
