import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

const submitEval = gql`
    mutation processEvaluation($itemId: String!, $evaluation: Int!){
        processEvaluation(itemId:$itemId, evaluation: $evaluation){
            item {
                _id
                flashcardId
                extraRepeatToday
                actualTimesRepeated
            }
            flashcard
            {
                _id question answer
            }
        }
    }
`

export default function () {
  return graphql(submitEval, {
    props: ({ownProps, mutate}) => ({
      submit: ({itemId, evaluation}) => mutate({
        variables: {
          itemId,
          evaluation
        },
        updateQueries: {
          CurrentItems: (prev, {mutationResult}) => {
            const updateResults = update(prev, {
              ItemsWithFlashcard: {
                $set: mutationResult.data.processEvaluation
              }
            })
            return updateResults
          }
        }
      })
    })
  })
}
