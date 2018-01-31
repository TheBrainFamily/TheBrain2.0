import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import lessonWatchedMutation from 'thebrain-shared/graphql/queries/lessonWatchedMutation'
import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import clearNotCasualItems from 'thebrain-shared/graphql/mutations/clearNotCasualItems'
import courseById from 'thebrain-shared/graphql/queries/courseById'
import LevelUpWrapper from '../../components/LevelUpWrapper'
import lessonWatchedMutationParams from 'thebrain-shared/graphql/mutations/lessonWatchedMutationParams'

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const lectureWrapper = compose(
  connect(mapStateToProps),
  graphql(lessonWatchedMutation, lessonWatchedMutationParams),
  // TODO can't we simplify this?
  graphql(clearNotCasualItems, {
    props: ({ownProps, mutate}) => ({
      clearNotCasual: () => mutate({
      })
    })
  }),
  graphql(currentLessonQuery, {
    options: (ownProps) => {
      const selectedCourse = (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
      return ({
        variables: {courseId: selectedCourse},
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(courseById, {
    options: (ownProps) => {
      const selectedCourse = (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
      return ({
        variables: {_id: selectedCourse},
        fetchPolicy: 'network-only'
      })
    },
    name: 'courseData'
  }),
  LevelUpWrapper
)
