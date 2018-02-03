import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import { getGraphqlForChangePasswordMutation } from 'thebrain-shared/graphql/queries/changePasswordMutation'
import { getGraphqlForSwitchUserIsCasual } from 'thebrain-shared/graphql/mutations/switchUserIsCasual'

export const profileWrapper = compose(
  connect(),
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
  }),
  getGraphqlForChangePasswordMutation(graphql),
  getGraphqlForSwitchUserIsCasual(graphql)
)
