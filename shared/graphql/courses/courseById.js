// @flow

import gql from 'graphql-tag'

export default gql`
    query Course($_id: String!) {
        Course(_id: $_id) {
            _id, name, color
        }
    }
`
