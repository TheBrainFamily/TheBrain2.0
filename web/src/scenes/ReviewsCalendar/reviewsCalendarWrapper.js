import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'

import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'

const reviewsQuery = gql`
    query Reviews {
        Reviews {
            ts, count
        }
    }
`
const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const reviewsCalendarWrapper = compose(
  connect(mapStateToProps),
  graphql(currentLessonQuery, {
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
  }),
  graphql(reviewsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)
