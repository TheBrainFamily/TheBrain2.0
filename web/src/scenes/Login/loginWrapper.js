import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo/'
import { withRouter } from 'react-router'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import { getGraphqlForSignup } from 'thebrain-shared/graphql/mutations/setUsernameAndPasswordForGuest'
import { getGraphqlForLogin } from 'thebrain-shared/graphql/mutations/logIn'

export const loginWrapper = compose(
  connect(),
  withRouter,
  getGraphqlForSignup(graphql),
  getGraphqlForLogin(graphql),
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
  })
)
