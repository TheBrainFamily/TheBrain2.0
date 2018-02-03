import { getGraphqlForCloseCourseMutation } from 'thebrain-shared/graphql/courses/closeCourse'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import currentLessonQuery from 'thebrain-shared/graphql/lessons/currentLesson'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const headerWrapper = compose(
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
  getGraphqlForCloseCourseMutation(graphql),
  graphql(currentUserQuery)
)
