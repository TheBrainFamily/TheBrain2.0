import { graphql, compose } from 'react-apollo'
import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import sessionCount from 'thebrain-shared/graphql/items/sessionCount'

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
