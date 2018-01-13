// @flow
import casual from 'casual'
import _ from 'lodash'
import moment from 'moment'

import resolvers from './resolvers'
import { deepFreeze, extendExpect } from '../testHelpers/testHelpers'
import { CoursesRepository } from './repositories/CoursesRepository'
import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { ItemsRepository } from './repositories/ItemsRepository'
import { UsersRepository } from './repositories/UsersRepository'
import { UserDetailsRepository } from './repositories/UserDetailsRepository'

const mongoose = {}
extendExpect()
// jest.mock('node-fetch', () => {
//   return async () => ({
//     json: async () => ({
//       data: {
//         is_valid: true
//       }
//     })
//   })
// })

// async function createFlashcard (props) {
//   const newFlashcard = new Flashcards(props)
//   await newFlashcard.save()
// }

// async function createFlashcards (flashcardsData) {
//   await Promise.all(flashcardsData.map(createFlashcard))
// }

const mongoObjectId = function () {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16)
  }).toLowerCase()
}

casual.define('flashcard', function () {
  return {
    _id: mongoObjectId(),
    question: casual.sentence,
    answer: casual.sentence
  }
})

casual.define('item', function () {
  return {
    _id: mongoObjectId(),
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

async function makeItems ({number: number = 2, itemsToExtend = [], itemsCollection}: MakeItemsData = {}) {
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

describe('query.Item', () => {
  // TODO is this used on the frontend?
  it.skip('returns a specific item', async () => {
    const userId = mongoObjectId()
    const itemsRepository = new ItemsRepository()
    await itemsRepository.itemsCollection.insert({userId, extraRepeatToday: true})
    const newItemId = mongoObjectId()
    await itemsRepository.itemsCollection.insert({userId, _id: newItemId, extraRepeatToday: false})
    const context = {Items: itemsRepository, user: {_id: userId}}

    const course = await resolvers.Query.Item(undefined, {_id: newItemId}, context)

    expect(course.extraRepeatToday).toEqual(false)
  })
})

describe('query.Items', () => {
  it('returns 0 items if no user exists', async () => {
    // XXX This test doesn't really check anything, of course it's going to return 0 items, since there are no items in the db
    const context = {Items: new ItemsRepository()}

    const items = await resolvers.Query.Items(undefined, undefined, context)

    expect(items.length).toBe(0)
  })

  it('returns 0 items for a new user without any lessons watched', async () => {
    // XXX This test doesn't really check anything, of course it's going to return 0 items, since there are no items in the db
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      casual: false
    })
    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      Items: new ItemsRepository()
    }

    const items = await resolvers.Query.Items(undefined, undefined, context)

    expect(items.length).toBe(0)
  })
})

describe('mutation.selectCourse', () => {
  let context
  beforeAll(async () => {
    const coursesRepository = new CoursesRepository()
    await coursesRepository.coursesCollection.insert({_id: 'testCourseId'})
    const usersRepository = new UsersRepository()
    const userDetailsRepository = new UserDetailsRepository()
    context = {
      user: {},
      Users: usersRepository,
      UserDetails: userDetailsRepository,
      req: {
        logIn: jest.fn()
      }
    }
  })
  // TODO mock the mongodb ObjectID so it doesn't require the 12 bytes for the next two
  it.skip('saves info about a course selected if no user exists', async () => {
    const result = await resolvers.Mutation.selectCourse(undefined, {courseId: 'testCourseId'}, context)
    expect(result.userId).toBeDefined()
    expect(result.progress[0]).toEqual({courseId: 'testCourseId', lesson: 1})
    expect(result.selectedCourse).toEqual('testCourseId')
  })
  it.skip('saves info about a course selected by a user', async () => {
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })
    context.user = {_id: userId}

    const result = await resolvers.Mutation.selectCourse(undefined, {courseId: 'testCourseId'}, context)
    expect(result.userId).toBeDefined()
    expect(result.progress[0]).toEqual({courseId: 'testCourseId', lesson: 1})
    expect(result.selectedCourse).toEqual('testCourseId')
  })
})

describe('mutation.processEvaluation', () => {
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
    const items = await resolvers.Mutation.processEvaluation(undefined, args, context)
    const item = _.find(items, (item) => item._id === args.itemId)
    expect(item.actualTimesRepeated).toEqual(1)
  })
})

// There is one test and it's hard to test what was it originally tested anyway,
// there is an if inside an if inside an if here, every path should be covered separately
// I'm commenting this out instead of fixing it, as it's hard to say what's the expected behavior

describe.skip('login with facebook', async () => {
  it('returns user if it already exists', async () => {
    const userDetailsRepository = new UserDetailsRepository()
    const usersRepository = new UsersRepository()
    const {logInWithFacebook} = resolvers.Mutation
    const userId = mongoObjectId()
    await mongoose.connection.db.collection('user').insert({
      username: 'fbUsername',
      facebookId: 'facebookId'
    })
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })
    const args = {
      accessToken: 'TOKEN',
      userIdFb: 'facebookId'
    }

    const user = deepFreeze({username: 'test'})

    const context = {
      Users: usersRepository,
      UserDetails: userDetailsRepository,
      req: {
        logIn: jest.fn()
      }
    }

    await logInWithFacebook(undefined, args, context)
    expect(context.req.logIn.mock.calls[0]).toContain(user)
  })
})

describe('query.Reviews', () => {
  it('returns empty list by default', async () => {
    const itemsRepository = new ItemsRepository()
    const userDetailsRepository = new UserDetailsRepository()
    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })
    const context = {user: {_id: userId}, Items: itemsRepository, UserDetails: userDetailsRepository}

    const reviews = await resolvers.Query.Reviews(undefined, undefined, context)

    expect(reviews.length).toBe(0)
  })

  it('returns list of reviews grouped by day timestamp', async () => {
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

    const reviews = await resolvers.Query.Reviews(undefined, undefined, context)

    expect(reviews).toEqual([
      {ts: tomorrowDate.clone().utc().startOf('day').unix(), count: 1},
      {ts: dayAfterTomorrowDate.clone().utc().startOf('day').unix(), count: 2}
    ])
  })
})
