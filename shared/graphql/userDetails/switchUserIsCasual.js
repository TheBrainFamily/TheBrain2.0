import gql from 'graphql-tag'
import update from 'immutability-helper'

const switchUserIsCasualMutation = gql`
    mutation switchUserIsCasual {
        switchUserIsCasual {
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
export const getGraphqlForSwitchUserIsCasual = (graphql) => {
  return graphql(switchUserIsCasualMutation, {
    props: ({ownProps, mutate}) => ({
      switchUserIsCasual: () => mutate({
        updateQueries: {
          UserDetails: (prev, {mutationResult}) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.switchUserIsCasual
              }
            })
          }
        }
      })
    })
  })
}
