// @flow

import gql from 'graphql-tag'

const lessonsQuery = gql`
    query Lessons($courseId: String!) {
        Lessons(courseId: $courseId) {
            _id, position, description, youtubeId
        }
    }
`

export const getGraphqlForLessonsQuery = (graphql) => {
  return graphql(lessonsQuery, {
    name: 'lessons',
    options: (ownProps) => {
      if (!ownProps.selectedCourse) {
        return ({
          variables: {
            courseId: ''
          }
        })
      }
      const courseId = ownProps.selectedCourse._id
      return {
        variables: {courseId}
      }
    }
  })
}
