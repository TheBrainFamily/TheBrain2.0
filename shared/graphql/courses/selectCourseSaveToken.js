import gql from 'graphql-tag'
import update from 'immutability-helper'

const selectCourseSaveTokenMutation = gql`
    mutation selectCourseSaveToken($courseId: String!, $deviceId: String) {
        selectCourseSaveToken(courseId: $courseId, deviceId: $deviceId) {
            selectedCourse
            hasDisabledTutorial
            isCasual
            experience {
                level
                showLevelUp
            }
        }
    }
`

export const getGraphqlForSelectCourseSaveTokenMutation = (graphql) => {
  return graphql(selectCourseSaveTokenMutation, {
    props: ({ ownProps, mutate }) => ({
      selectCourseSaveToken: ({ courseId, deviceId }) => mutate({
        variables: {
          courseId,
          deviceId
        },
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.selectCourseSaveToken
              }
            })
          }
        }
      })
    })
  })
}
