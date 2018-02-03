import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { getGraphqlForLessonsQuery } from 'thebrain-shared/graphql/lessons/lessons'
import { getGraphqlForCurrentLessonOptionalCourse } from 'thebrain-shared/graphql/lessons/currentLesson'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const lecturesWrapper = compose(
  connect(mapStateToProps),
  getGraphqlForCurrentLessonOptionalCourse(graphql),
  getGraphqlForLessonsQuery(graphql)
)
