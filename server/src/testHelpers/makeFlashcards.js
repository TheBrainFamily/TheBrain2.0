// @flow
import _ from 'lodash'
import casual from 'casual'
import { mongoObjectId } from './mongoObjectId'

casual.define('flashcard', function () {
  return {
    _id: mongoObjectId(),
    question: casual.sentence,
    answer: casual.sentence
  }
})

type MakeFlashcardsData = {
  number?: number,
  flashcardsToExtend?: Array<Object>
}

export async function makeFlashcards ({number: number = 3, flashcardsToExtend = [], baseFlashcard, flashcardRepository, idPrefix}: MakeFlashcardsData = {}) {
  const addedFlashcards = []
  _.times(number, (index) => {
    let newFlashcard = casual.flashcard
    if (flashcardsToExtend[index] || baseFlashcard) {
      newFlashcard = {
        ...newFlashcard,
        _id: `${idPrefix}${newFlashcard._id}`,
        ...flashcardsToExtend[index] || baseFlashcard
      }
    }
    addedFlashcards.push(newFlashcard)
  }
  )
  await flashcardRepository.flashcardsCollection.insert(addedFlashcards)

  return addedFlashcards
}
