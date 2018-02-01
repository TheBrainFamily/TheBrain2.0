import _ from 'lodash'
import gql from 'graphql-tag'
import currentItemsQuery from '../queries/itemsWithFlashcard'
import sessionCountQuery from '../queries/sessionCount'
import userDetailsQuery from '../queries/userDetails'

const processEvaluationMutation = gql`
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
export const getGraphqlForProcessEvaluationMutation = (graphql) => {
  return graphql(processEvaluationMutation, {
    props: ({ownProps, mutate}) => ({
      submit: ({itemId, evaluation}) => mutate({
        variables: {
          itemId,
          evaluation
        },
        optimisticResponse: {
          processEvaluation: {
            // Without this fake data we get warnings in the client on every evaluation :-(
            '_id': '-1',
            'flashcardId': '',
            'extraRepeatToday': false,
            'actualTimesRepeated': 0,
            '__typename': 'Item', // this used to be Items, double check that it still works
            'flashcard': {
              '_id': '-1',
              'question': '',
              'answer': '',
              'isCasual': true,
              'image': null,
              'answerImage': null,
              '__typename': 'Flashcard'
            },
            switchFlashcards: true
          }
        },
        update: (proxy, { data: { processEvaluation } }) => {
          const data = proxy.readQuery({ query: currentItemsQuery })
          if (processEvaluation.switchFlashcards) {
            const newFlashcards = [_.last(data.Items)]
            data.Items = newFlashcards
          } else {
            data.Items = processEvaluation
          }
          proxy.writeQuery({ query: currentItemsQuery, data })
        },
        refetchQueries: [{
          query: sessionCountQuery
        }, {
          query: userDetailsQuery
        }
        ]
      })
    })
  })
}
