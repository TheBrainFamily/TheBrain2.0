import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

const submitEval = gql`
    mutation processEvaluation($itemId: String!, $evaluation: Float!){
        processEvaluation(itemId:$itemId, evaluation: $evaluation){
            _id
            flashcardId
            extraRepeatToday
            actualTimesRepeated
            flashcard
            {
                _id question answer isCasual
                image {
                    url
                    hasAlpha
                }
                answerImage {
                    url
                    hasAlpha
                }
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
              Items: {
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
