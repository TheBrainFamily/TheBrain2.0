import { graphql, compose } from 'react-apollo'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import sessionCount from 'thebrain-shared/graphql/queries/sessionCount'

export const menuProfileWrapper = compose(
  graphql(sessionCount, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)
