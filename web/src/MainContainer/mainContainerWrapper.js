import { compose, graphql } from 'react-apollo'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'

export const mainContainerWrapper = compose(
  graphql(currentUserQuery)
)
