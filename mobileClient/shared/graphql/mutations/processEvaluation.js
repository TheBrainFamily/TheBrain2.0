import gql from 'graphql-tag'

export default gql`
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
