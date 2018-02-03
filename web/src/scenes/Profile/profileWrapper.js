import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import { getGraphqlForChangePasswordMutation } from 'thebrain-shared/graphql/account/changePasswordMutation'
import { getGraphqlForSwitchUserIsCasual } from 'thebrain-shared/graphql/userDetails/switchUserIsCasual'

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
