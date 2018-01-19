import gql from 'graphql-tag'
import _ from 'lodash'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'

import { UserDetailsRepository } from './repositories/UserDetailsRepository'
import { LessonsRepository } from './repositories/LessonsRepository'
import schema from './schema'
import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { mongoObjectId } from '../testHelpers/mongoObjectId'
import { makeFlashcards } from '../testHelpers/makeFlashcards'

describe('mutation.createItemsAndMarkLessonAsWatched', () => {
  it('creates an item for the next lesson, making sure the first two are casual', async () => {
    const Flashcards = new FlashcardsRepository()
    const hardcoreFlashcards = await makeFlashcards({number: 4, baseFlashcard: {isCasual: false}, flashcardRepository: Flashcards, idPrefix: 'hardcore'})
    const casualFlashcards = await makeFlashcards({number: 4, baseFlashcard: {isCasual: true}, flashcardRepository: Flashcards, idPrefix: 'casual'})

    const allFlashcardIds = _.map([...hardcoreFlashcards, ...casualFlashcards], '_id')
    const Lessons = new LessonsRepository()
    await Lessons.lessonsCollection.insert({position: 2, courseId: 'testCourseId', flashcardIds: []})
    await Lessons.lessonsCollection.insert({position: 1, courseId: 'testCourseId', flashcardIds: allFlashcardIds})

    const userId = mongoObjectId()
    const UserDetails = new UserDetailsRepository()
    await UserDetails.userDetailsCollection.insert({
      userId,
      selectedCourse: 'testCourseId',
      progress: [{courseId: 'testCourseId', lesson: 1}],
      casual: false
    })

    const context = {
      UserDetails,
      Lessons,
      Flashcards,
      user: {_id: userId},
      req: {
        logIn: jest.fn()
      }
    }

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    await networkInterface.query({
      query: gql`
          mutation ($courseId: String!) {
              createItemsAndMarkLessonAsWatched(courseId: $courseId) {
                  _id
              }
          },
      `,
      variables: {courseId: 'testCourseId'}
    })

    let result = await networkInterface.query({
      query: gql`
          query {
              Items  {
                  _id
                  flashcard {
                      _id
                      isCasual
                  }
              }
          },
      `
    })

    const itemsWithFlashcards = result.data
    expect(_.map(itemsWithFlashcards.Items, (item) => item.flashcard.isCasual)).toEqual([true, true])
  })
})
