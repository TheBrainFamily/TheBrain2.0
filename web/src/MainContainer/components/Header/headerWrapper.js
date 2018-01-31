import closeCourseMutation from 'thebrain-shared/graphql/mutations/closeCourse'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'

import update from 'immutability-helper/index'

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
  graphql(closeCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      closeCourse: () => mutate({
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.closeCourse
              }
            })
          }
        }
      })
    })
  }),
  graphql(currentUserQuery)
)
