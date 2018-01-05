import gql from 'graphql-tag'

// TODO this is also in withProcessEvaluation
// TODO can we use fragments to get rid of duplication like here and in itemsWithFlashcard.js / currentItems.js
export default gql`
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
