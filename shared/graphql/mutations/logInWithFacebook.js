import gql from 'graphql-tag'
import update from 'immutability-helper'
import userDetailsQuery from '../queries/userDetails'

const logInWithFacebookMutation = gql`
    mutation logInWithFacebook($accessTokenFb: String!, $userIdFb: String!){
        logInWithFacebook(accessTokenFb:$accessTokenFb, userIdFb:$userIdFb) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`

export default logInWithFacebookMutation

export const getGraphqlForLogInWithFacebookMutation = (graphql) => {
  return graphql(logInWithFacebookMutation, {
    props: ({ownProps, mutate}) => ({
      logInWithFacebook: ({accessTokenFb, userIdFb}) => mutate({
        variables: {
          accessTokenFb,
          userIdFb
        },
        updateQueries: {
          CurrentUser: (prev, {mutationResult}) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebook
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
