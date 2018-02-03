import { getGraphqlForCloseCourseMutation } from 'thebrain-shared/graphql/courses/closeCourse'
import { getGraphqlForCurrentLessonOptionalCourse } from 'thebrain-shared/graphql/lessons/currentLesson'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const headerWrapper = compose(
  connect(mapStateToProps),
  getGraphqlForCurrentLessonOptionalCourse(graphql),
  getGraphqlForCloseCourseMutation(graphql),
  graphql(currentUserQuery)
)
