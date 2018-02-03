// @flow

import gql from 'graphql-tag'

const currentLessonQuery = gql`
    query Lesson($courseId: String!) {
        Lesson(courseId: $courseId) {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`

export const getGraphqlForCurrentLesson = (graphql, name, skip, courseIdSelector = (ownProps) => ownProps.selectedCourse._id) => {
  return graphql(currentLessonQuery, {
    name,
    skip,
    options: (ownProps) => {
      const courseId = courseIdSelector(ownProps)
      return ({
        variables: { courseId },
        fetchPolicy: 'network-only'
      })
    }
  })
}

export const getGraphqlForCurrentLessonOptionalCourse = (graphql) => {
  return graphql(currentLessonQuery, {
    name: 'currentLesson',
    options: (ownProps) => {
      if (!ownProps.selectedCourse) {
        return ({
          variables: {
            courseId: ''
          }
        })
      }
      const courseId = ownProps.selectedCourse._id
      return ({
        variables: { courseId }
      })
    }
  })
}
