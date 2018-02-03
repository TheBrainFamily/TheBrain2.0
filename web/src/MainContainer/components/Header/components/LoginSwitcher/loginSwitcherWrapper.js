import { connect } from 'react-redux'
import { compose, withApollo, graphql } from 'react-apollo'
import { getGraphqlForLogout } from 'thebrain-shared/graphql/mutations/logout'

export const loginSwitcherWrapper = compose(
  withApollo,
  connect(),
  getGraphqlForLogout(graphql)
)
