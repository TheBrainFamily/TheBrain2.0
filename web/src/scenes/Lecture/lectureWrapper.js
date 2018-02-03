import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import lessonWatchedMutation from 'thebrain-shared/graphql/items/lessonWatchedMutation'
import { getGraphqlForCurrentLesson } from 'thebrain-shared/graphql/lessons/currentLesson'
import clearNotCasualItems from 'thebrain-shared/graphql/items/clearNotCasualItems'
import courseById from 'thebrain-shared/graphql/courses/courseById'
import lessonWatchedMutationParams from 'thebrain-shared/graphql/lessons/lessonWatchedMutationParams'
import LevelUpWrapper from '../../components/LevelUpWrapper'

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
  getGraphqlForCurrentLesson({
    graphql,
    courseIdSelector: ownProps => (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
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
