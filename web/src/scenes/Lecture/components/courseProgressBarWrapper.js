import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getGraphqlForCurrentLesson } from 'thebrain-shared/graphql/lessons/currentLesson'
import lessonCountQuery from 'thebrain-shared/graphql/lessons/lessonCount'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const courseProgressBarWrapper = compose(
  connect(mapStateToProps),
  withRouter,
  getGraphqlForCurrentLesson(graphql, 'currentLesson', null, ownProps => (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId),
  graphql(lessonCountQuery, {name: 'lessonCount'})
)
