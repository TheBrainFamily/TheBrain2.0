import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import confirmLevelUpMutation from 'thebrain-shared/graphql/userDetails/confirmLevelUp'

export const congratulationsWrapper = compose(
  connect(),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(confirmLevelUpMutation, {
    props: ({ ownProps, mutate }) => ({
      confirmLevelUp: () => mutate({
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)
