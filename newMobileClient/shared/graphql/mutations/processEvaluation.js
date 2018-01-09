import gql from 'graphql-tag'

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
