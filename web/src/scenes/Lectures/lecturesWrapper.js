import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import { getGraphqlForLessonsQuery } from 'thebrain-shared/graphql/queries/lessons'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const lecturesWrapper = compose(
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
  getGraphqlForLessonsQuery(graphql)
)
