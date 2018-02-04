// @flow

import gql from 'graphql-tag'

export default gql`
    query CurrentUser {
        CurrentUser {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`
