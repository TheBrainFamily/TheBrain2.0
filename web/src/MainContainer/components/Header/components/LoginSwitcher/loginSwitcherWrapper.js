import { connect } from 'react-redux'
import { compose, withApollo, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper/index'

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

export const loginSwitcherWrapper = compose(
  withApollo,
  connect(),
  graphql(logOutQuery, {
    props: ({ ownProps, mutate }) => ({
      logout: () => mutate({
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
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
)
