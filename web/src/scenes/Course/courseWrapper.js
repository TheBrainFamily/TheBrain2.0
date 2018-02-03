import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import currentItemsExistQuery from 'thebrain-shared/graphql/items/currentItemsExist'

export const courseWrapper = compose(
  connect(),
  withRouter,
  graphql(currentItemsExistQuery, {
    options: {
      fetchPolicy: 'network-only'
    }
  })
)
