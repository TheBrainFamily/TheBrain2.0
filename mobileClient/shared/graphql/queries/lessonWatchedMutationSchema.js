import gql from 'graphql-tag'

export default gql`
    mutation createItemsAndMarkLessonAsWatched($courseId: String!) {
        createItemsAndMarkLessonAsWatched(courseId: $courseId) {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`
