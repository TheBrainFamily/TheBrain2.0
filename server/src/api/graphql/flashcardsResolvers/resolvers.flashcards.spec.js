import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { deepFreeze, extendExpect } from '../../../testHelpers/testHelpers'
import schema from '../schema'
import { mongoObjectId } from '../../../testHelpers/mongoObjectId'
import { FlashcardsRepository } from '../../repositories/FlashcardsRepository'
import { makeFlashcards } from '../../../testHelpers/makeFlashcards'

extendExpect()

describe('Query: Flashcards', () => {
  it('returns flashcards from the db 1', async () => {
    const flashcardRepository = new FlashcardsRepository()
    const flashcardsData = await deepFreeze(makeFlashcards({flashcardRepository}))
    const context = {Flashcards: flashcardRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              Flashcards {
                  question,
                  answer,
                  _id
              }
          },
      `
      }))
    const dbFlashcards = result.data.Flashcards

    // WHY: _id is a string in response from GraphQL
    // Expected value to be (using ===):
    // [{"_id": 2, "answer": "Consectetur qua
    //   Received:
    //     [{"_id": "2", "answer": "Consectetur q

    expect(dbFlashcards.length).toBe(3)
    expect(dbFlashcards).toContainDocuments(flashcardsData)
  })
})
describe('Query: Flashcard', () => {
  it('returns a flashcard by id', async () => {
    const flashcardsToExtend = [
      {_id: mongoObjectId()}, {_id: mongoObjectId()}
    ]
    const flashcardRepository = new FlashcardsRepository()
    const flashcardsData = await makeFlashcards({flashcardsToExtend, flashcardRepository})
    const context = {Flashcards: flashcardRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query ($_id: String!) {
              Flashcard(_id:$_id) {
                  _id
              }
          },
      `,
        variables: {_id: flashcardsData[1]._id}
      }))
    const dbFlashcard = result.data.Flashcard

    expect(dbFlashcard._id).toEqual(flashcardsData[1]._id)
  })
})
