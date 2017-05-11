// @flow

import gql from 'graphql-tag'

export default gql`
    query SessionCount {
        SessionCount {
            newDone
            newTotal
            dueDone
            dueTotal
            reviewDone
            reviewTotal
        }
    }
`
