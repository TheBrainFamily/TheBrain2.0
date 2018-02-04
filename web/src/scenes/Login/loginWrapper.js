import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo/'
import { withRouter } from 'react-router'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import { getGraphqlForSignup } from 'thebrain-shared/graphql/account/setUsernameAndPasswordForGuest'
import { getGraphqlForLogin } from 'thebrain-shared/graphql/account/logIn'

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
