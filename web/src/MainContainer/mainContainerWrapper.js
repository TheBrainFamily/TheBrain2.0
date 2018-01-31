import { compose, graphql } from 'react-apollo'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'

export const mainContainerWrapper = compose(
  graphql(currentUserQuery)
)
