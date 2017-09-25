import gql from 'graphql-tag'

export default gql`
    query CurrentItems {
        ItemsWithFlashcard {
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
                    url hasAlpha
                }
                answerImage {
                    url hasAlpha
                }
            }
        }
    }
`