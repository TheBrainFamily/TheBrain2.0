// @flow

import gql from 'graphql-tag'

export default gql`
    query Lesson($courseId: String!) {
        Lesson(courseId: $courseId) {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`
