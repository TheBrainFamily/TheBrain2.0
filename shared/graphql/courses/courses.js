// @flow

import gql from 'graphql-tag'

export default gql`
    query Courses {
        Courses {
            _id, name, color, isDisabled
        }
    }
`
