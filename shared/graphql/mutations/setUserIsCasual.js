import gql from 'graphql-tag'
import update from 'immutability-helper'
import currentItemsQuery from '../queries/itemsWithFlashcard'

const setUserIsCasualMutation = gql`
    mutation setUserIsCasual($isCasual: Boolean!) {
        setUserIsCasual(isCasual:$isCasual) {
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

export const getGraphqlFotSetUserIsCasualMutation = (graphql) => {
  return graphql(setUserIsCasualMutation, {
    props: ({ownProps, mutate}) => ({
      setUserIsCasual: (isCasual) => mutate({
        variables: {
          isCasual
        },
        updateQueries: {
          UserDetails: (prev, {mutationResult}) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.setUserIsCasual
              }
            })
          }
        },
        refetchQueries: [{
          query: currentItemsQuery
        }]
      })
    })
  })
}
