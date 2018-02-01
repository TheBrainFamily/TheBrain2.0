import gql from 'graphql-tag'
import update from 'immutability-helper'
import userDetailsQuery from '../queries/userDetails'

const logInWithFacebookAccessToken = gql`
    mutation logInWithFacebookAccessToken($accessTokenFb: String!){
        logInWithFacebookAccessToken(accessTokenFb:$accessTokenFb) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`

export const getGraphqlForLogInWithFacebookAccessToken = (graphql) => {
  return graphql(logInWithFacebookAccessToken, {
    props: ({ownProps, mutate}) => ({
      logInWithFacebookAccessToken: ({accessTokenFb}) => mutate({
        variables: {
          accessTokenFb
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebookAccessToken
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
