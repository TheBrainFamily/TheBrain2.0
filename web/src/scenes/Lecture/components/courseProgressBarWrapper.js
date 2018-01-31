import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import lessonCountQuery from 'thebrain-shared/graphql/queries/lessonCount'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const courseProgressBarWrapper = compose(
  connect(mapStateToProps),
  withRouter,
  graphql(currentLessonQuery, {
    name: 'currentLesson',
    options: (ownProps) => {
      const selectedCourse = (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
      return ({
        variables: {courseId: selectedCourse},
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(lessonCountQuery, {name: 'lessonCount'})
)
