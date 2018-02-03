import gql from 'graphql-tag'
import update from 'immutability-helper'

const closeCourseMutation = gql`
    mutation closeCourse {
        closeCourse {
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
export const getGraphqlForCloseCourseMutation = (graphql) => {
  return graphql(closeCourseMutation, {
    props: ({ mutate }) => ({
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
  })
}
