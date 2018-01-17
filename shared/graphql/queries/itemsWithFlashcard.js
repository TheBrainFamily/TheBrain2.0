import gql from 'graphql-tag'

// TODO change the filename here
export default gql`
    query CurrentItems {
        Items {
            _id
            flashcardId
            extraRepeatToday
            actualTimesRepeated
            flashcard
            {
                _id question answer isCasual
                image {
                    url hasAlpha
                }
                answerImage {
                    url hasAlpha
                }
            }
        }
    }
`
