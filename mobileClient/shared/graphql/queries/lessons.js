// @flow

import gql from 'graphql-tag'

export default gql`
    query Lessons($courseId: String!) {
        Lessons(courseId: $courseId) {
            _id, position, description, youtubeId
        }
    }
`
