// @flow

import gql from 'graphql-tag'

export default gql`
    query Lesson {
        Lesson {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`
