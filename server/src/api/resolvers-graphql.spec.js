import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { ItemsWithFlashcardRepository } from './repositories/ItemsWithFlashcardRepository'
import resolvers from './resolvers'
import { UserDetailsRepository } from './repositories/UserDetailsRepository'
import { ItemsRepository } from './repositories/ItemsRepository'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import schema from './schema'
import casual from "casual"
import gql from 'graphql-tag'

//TODO extract the common functionality to a test helper
const mongoObjectId = function () {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16)
  }).toLowerCase()
}


casual.define('flashcard', function () {
  return {
    // _id: mongoObjectId(),
    question: casual.sentence,
    answer: casual.sentence
  }
})

casual.define('item', function () {
  return {
    flashcardId: mongoObjectId(),
    userId: mongoObjectId(),
    actualTimesRepeated: 0,
    easinessFactor: 2.5,
    extraRepeatToday: false,
    lastRepetition: 0,
    nextRepetition: 0,
    previousDaysChange: 0,
    timesRepeated: 0
  }
})


type MakeItemsData = {
  number?: number,
  itemsToExtend?: Array<Object>
}

function makeItems ({number: number = 2, itemsToExtend = [], itemsCollection}: MakeItemsData = {}) {
  const addedItems = []
  _.times(number, (index) => {
    let newFlashcard = casual.item
    if (itemsToExtend[index]) {
      newFlashcard = {
        ...newFlashcard,
        ...itemsToExtend[index]
      }
    }
    addedItems.push(newFlashcard)
  })
  return addedItems.map(item => itemsCollection.insert(item))
}


describe("Items query", async() => {
  it('returns two items with flashcards attached for a new user after watching the first lesson', async () => {
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      selectedCourse: 'selectedCourse',
      casual: false,
    })

    const flashcardsRepository = new FlashcardsRepository()
    const flashcardId = mongoObjectId()
    await flashcardsRepository.flashcardsCollection.insert({_id: flashcardId, question: 'firstQuestion', answer: '!'})
    const secondFlashcardId = mongoObjectId()
    await flashcardsRepository.flashcardsCollection.insert({
      _id: secondFlashcardId,
      question: 'secondQuestion',
      answer: '!'
    })

    const itemsRepository = new ItemsRepository()

    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      Items: itemsRepository,
      Flashcards: flashcardsRepository,

    }
    const itemsToExtend = [
      {userId, flashcardId: secondFlashcardId, courseId: 'selectedCourse'}, {userId, flashcardId, courseId: 'selectedCourse'},
    ]
    const returnedFromItems = await makeItems({itemsToExtend, itemsCollection: itemsRepository.itemsCollection})


    let result = (await mockNetworkInterfaceWithSchema({schema, context})
    .query({
      query: gql`
          query {
              Items {
                  flashcardId
                  flashcard {
                      question
                  }
              }
          }
      `
    }))

    const flashcard = result.data.Items[0].flashcard
    const item = result.data.Items[0]

    expect(flashcard.question).toEqual('secondQuestion')

    expect(item.flashcardId).toEqual(secondFlashcardId)

    expect(result.errors).not.toBeDefined()
  })
})
