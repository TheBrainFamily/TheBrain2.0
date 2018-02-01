import _ from 'lodash'
import moment from 'moment'
import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { ItemsRepository } from '../../repositories/ItemsRepository'
import { UserDetailsRepository } from '../../repositories/UserDetailsRepository'
import { makeItems } from '../../../testHelpers/makeItems'
import schema from '../schema'
import { mongoObjectId } from '../../../testHelpers/mongoObjectId'
import { FlashcardsRepository } from '../../repositories/FlashcardsRepository'
import { LessonsRepository } from '../../repositories/LessonsRepository'
import { makeFlashcards } from '../../../testHelpers/makeFlashcards'

describe('Query: Reviews', () => {
  it('returns empty list by default', async () => {
    const itemsRepository = new ItemsRepository()
    const userDetailsRepository = new UserDetailsRepository()
    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })
    const context = {user: {_id: userId}, Items: itemsRepository, UserDetails: userDetailsRepository}
    const {data} = (await mockNetworkInterfaceWithSchema({schema, context}).query({
      query: gql`
          query {
              Reviews {
                  count
                  ts
              }
          }
      `
    }))
    const {Reviews: reviews} = data
    expect(reviews.length).toBe(0)
  })
  it.skip('returns list of reviews grouped by day timestamp', async () => {
    const itemsRepository = new ItemsRepository()
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })
    const context = {user: {_id: userId}, Items: itemsRepository, UserDetails: userDetailsRepository}
    const tomorrowDate = moment().add(1, 'day')
    const dayAfterTomorrowDate = moment().add(2, 'day')
    const itemsToExtend = [
      {userId, nextRepetition: tomorrowDate.unix()}, {userId, nextRepetition: dayAfterTomorrowDate.unix()},
      {userId, nextRepetition: dayAfterTomorrowDate.add(1, 'hour').unix()}
    ]
    await makeItems({itemsToExtend, number: itemsToExtend.length, itemsCollection: itemsRepository.itemsCollection})
    const {data} = (await mockNetworkInterfaceWithSchema({schema, context}).query({
      query: gql`
          query {
              Reviews {
                  count
                  ts
              }
          }
      `
    }))
    const {Reviews: reviews} = data
    expect(reviews).toEqual([
      {ts: tomorrowDate.clone().utc().startOf('day').unix(), count: 1},
      {ts: dayAfterTomorrowDate.clone().utc().startOf('day').unix(), count: 2}
    ])
  })
})
describe('Query: Items ', async () => {
  it('return zero item if no user exist', () => {

  })
  it('returns two items with flashcards attached for a new user after watching the first lesson', async () => {
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      selectedCourse: 'selectedCourse',
      casual: false
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
      Flashcards: flashcardsRepository
    }
    const itemsToExtend = [
      {userId, flashcardId: secondFlashcardId, courseId: 'selectedCourse'}, {
        userId,
        flashcardId,
        courseId: 'selectedCourse'
      }
    ]
    await makeItems({itemsToExtend, itemsCollection: itemsRepository.itemsCollection})

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
describe('Query: SessionCount', () => {
  it('returns an empty object if no user exists', async () => {
    const itemsRepository = new ItemsRepository()

    const context = {Items: itemsRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              SessionCount {
                  newDone
                  newTotal
                  dueDone
                  dueTotal
                  reviewDone
                  reviewTotal
              }
          }
      `
      }))
    const sessionCount = result.data.SessionCount

    expect(sessionCount).toEqual({
      newDone: null,
      newTotal: null,
      dueDone: null,
      dueTotal: null,
      reviewDone: null,
      reviewTotal: null
    })
  })
  it('returns a session count', async () => {
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      casual: false,
      selectedCourse: 'selectedCourse'
    })
    const itemsRepository = new ItemsRepository()

    await itemsRepository.itemsCollection.insert({userId, actualTimesRepeated: 0, courseId: 'selectedCourse'})
    const context = {
      user: {_id: userId},
      Items: itemsRepository,
      UserDetails: userDetailsRepository
    }

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              SessionCount {
                  newDone
                  newTotal
                  dueDone
                  dueTotal
                  reviewDone
                  reviewTotal
              }
          }
      `
      }))
    const sessionCount = result.data.SessionCount

    expect(sessionCount).toEqual(expect.objectContaining({
      newDone: 0,
      newTotal: 1,
      dueDone: 0,
      dueTotal: 0,
      reviewDone: 0,
      reviewTotal: 0
    }))
  })
})
describe('Mutation: createItemsAndMarkLessonAsWatched', () => {
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
  it('returns the second lesson after watching the first one if you are a logged in user', async () => {
    const Lessons = new LessonsRepository()
    await Lessons.lessonsCollection.insert({position: 2, courseId: 'testCourseId', flashcardIds: []})
    await Lessons.lessonsCollection.insert({position: 1, courseId: 'testCourseId', flashcardIds: []})

    const userId = mongoObjectId()
    const UserDetails = new UserDetailsRepository()
    await UserDetails.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}],
      casual: false
    })

    const context = {
      UserDetails,
      Lessons,
      user: {_id: userId},
      req: {
        logIn: jest.fn()
      }
    }

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    await networkInterface.query({
      query: gql`
          mutation CreateItems($courseId: String!) {
              createItemsAndMarkLessonAsWatched(courseId: $courseId) {
                  _id
              }
          },
      `,
      variables: {courseId: 'testCourseId'}
    })
    let result = await networkInterface.query({
      query: gql`
          query ($courseId: String!) {
              Lesson(courseId:$courseId) {
                  _id
                  position
              }
          },
      `,
      variables: {courseId: 'testCourseId'}
    })
    const lesson = result.data.Lesson

    expect(lesson.position).toBe(2)
  })
})
describe('Mutation: clearNotCasualItems', () => {
  let context = null
  let userId = null

  beforeEach(async () => {
    const userDetailsRepository = new UserDetailsRepository()
    userId = mongoObjectId()
    const itemRepository = new ItemsRepository()
    itemRepository.clearNotCasualItems = jest.fn()
    context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      Items: itemRepository
    }
  })

  it('clears non casual items if user is casual', async () => {
    await context.UserDetails.userDetailsCollection.insert({
      userId,
      isCasual: true
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation clearNotCasualItems {
              clearNotCasualItems
          },
      `
    })
    const {clearNotCasualItems: serverResponse} = data
    expect(serverResponse).toBe(true)
    expect(context.Items.clearNotCasualItems).toHaveBeenCalledTimes(1)
    expect(context.Items.clearNotCasualItems).toHaveBeenCalledWith(userId)
  })
  it('doesn\'t clear non casual items if user is not casual', async () => {
    await context.UserDetails.userDetailsCollection.insert({
      userId,
      isCasual: false
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation clearNotCasualItems {
              clearNotCasualItems
          },
      `
    })
    const {clearNotCasualItems: serverResponse} = data
    expect(serverResponse).toBe(true)
    expect(context.Items.clearNotCasualItems).toHaveBeenCalledTimes(0)
  })
})
describe('Mutation: processEvaluation', () => {
  it('returns a correct item after "Wrong" evaluation', async () => {
    const itemsRepository = new ItemsRepository()
    const flashcardsRepository = new FlashcardsRepository()
    const userDetailsRepository = new UserDetailsRepository()
    const userId = mongoObjectId()
    const courseId = 'courseId'
    await userDetailsRepository.create(userId, courseId)
    const context = {
      user: {_id: userId},
      Items: itemsRepository,
      Flashcards: flashcardsRepository,
      UserDetails: userDetailsRepository
    }
    const itemsToExtend = [
      {userId, _id: mongoObjectId(), courseId},
      {userId, _id: mongoObjectId(), courseId}
    ]

    await makeItems({itemsToExtend, itemsCollection: itemsRepository.itemsCollection})
    const args = {
      itemId: itemsToExtend[1]._id,
      evaluation: 2.5
    }

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {data} = await networkInterface.query({
      query: gql`
          mutation processEvaluation($itemId: String!, $evaluation: Float!) {
              processEvaluation(itemId: $itemId, evaluation: $evaluation) {
                  _id
                  actualTimesRepeated
                  easinessFactor
                  extraRepeatToday
                  flashcardId
                  lastRepetition
                  nextRepetition
                  previousDaysChange
                  timesRepeated
                  isCasual

              }
          },
      `,
      variables: {itemId: args.itemId, evaluation: args.evaluation}
    })
    const {processEvaluation: items} = data
    const item = _.find(items, (item) => item._id === args.itemId)
    expect(item.actualTimesRepeated).toEqual(1)
    expect(item.easinessFactor).toEqual(2.27)
    expect(item.extraRepeatToday).toEqual(true)
    expect(item.flashcardId).toBeTruthy()
    expect(item.lastRepetition).toBeGreaterThan(0)
    expect(item.nextRepetition).toBeGreaterThan(0)
    expect(item.previousDaysChange).toEqual(1)
    expect(item.timesRepeated).toEqual(0)
    // expect(item.isCasual).toEqual(0)
  })
})
