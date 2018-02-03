import { compose, graphql } from 'react-apollo'

import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import coursesQuery from 'thebrain-shared/graphql/courses/courses'

export const airplaneWrapperWrapper = compose(
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(coursesQuery, { name: 'courses' })
)
