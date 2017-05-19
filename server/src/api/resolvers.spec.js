// @flow

import mongoose from 'mongoose'
import casual from 'casual'
import _ from 'lodash'

import resolvers from './resolvers'
import {
  // Flashcards,
  FlashcardsRepository,
  ItemsRepository,
  ItemsWithFlashcardRepository,
  LessonsRepository,
  UserDetailsRepository,
  UsersRepository
} from './mongooseSetup'
import { deepFreeze, extendExpect } from 'testHelpers/testHelpers'

extendExpect()
jest.mock('node-fetch', () => {
  return async () => ({
    json: async () => ({
      data: {
        is_valid: true
      }
    })
  })
})

beforeAll((done) => {
  mongoose.connection.on('open', done)
})

afterAll(async () => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
})

// async function createFlashcard (props) {
//   const newFlashcard = new Flashcards(props)
//   await newFlashcard.save()
// }

// async function createFlashcards (flashcardsData) {
//   await Promise.all(flashcardsData.map(createFlashcard))
// }

casual.define('flashcard', function () {
  return {
    // _id: mongoose.Types.ObjectId(),
    question: casual.sentence,
    answer: casual.sentence
  }
})

casual.define('item', function () {
  return {
    flashcardId: mongoose.Types.ObjectId(),
    userId: mongoose.Types.ObjectId(),
    actualTimesRepeated: 0,
    easinessFactor: 2.5,
    extraRepeatToday: false,
    lastRepetition: 0,
    nextRepetition: 0,
    previousDaysChange: 0,
    timesRepeated: 0
  }
})

type MakeFlashcardsData = {
    number?: number,
    flashcardsToExtend?: Array<Object>
}

async function makeFlashcards ({ number: number = 3, flashcardsToExtend = [] }: MakeFlashcardsData = {}) {
  const addedFlashcards = []
  _.times(number, (index) => {
    let newFlashcard = casual.flashcard
    if (flashcardsToExtend[index]) {
      newFlashcard = {
        ...newFlashcard,
        ...flashcardsToExtend[index]
      }
    }
    addedFlashcards.push(newFlashcard)
      // await mongoose.connection.db.collection('flashcards').insert(newFlashcard)
  }
  )
  await mongoose.connection.db.collection('flashcards').insert(addedFlashcards)

  return addedFlashcards
}

type MakeItemsData = {
    number?: number,
    itemsToExtend?: Array<Object>
}

async function makeItems ({ number: number = 2, itemsToExtend = [] }: MakeItemsData = {}) {
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
  await mongoose.connection.db.collection('items').insert(addedItems)

  return addedItems
}

describe('query.flashcards', () => {
  afterEach(async (done) => {
    await mongoose.connection.db.dropDatabase()
    done()
  })
  it('returns flashcards from the db 1', async () => {
    const flashcardsData = await deepFreeze(makeFlashcards())

    const dbFlashcards = await resolvers.Query.Flashcards(undefined, undefined,
      {Flashcards: new FlashcardsRepository()}
    )

    expect(dbFlashcards.length).toBe(3)
    expect(dbFlashcards).toContainDocuments(flashcardsData)
  })
})

describe('query.flashcard', () => {
  afterEach(async (done) => {
    await mongoose.connection.db.dropDatabase()
    done()
  })
  it('returns a flashcard by id', async () => {
    const flashcardsToExtend = [
      {_id: mongoose.Types.ObjectId()}, {_id: mongoose.Types.ObjectId()}
    ]

    const flashcardsData = await makeFlashcards({flashcardsToExtend})

    const dbFlashcards = await resolvers.Query.Flashcard(undefined, {_id: flashcardsData[1]._id},
      {Flashcards: new FlashcardsRepository()}
    )

    expect(dbFlashcards._id).toEqual(flashcardsData[1]._id)
  })
})

describe('query.Lesson', () => {
  beforeAll(async () => {
    // we have those in different order to make sure the query doesn't return the first inserted lesson.
    await mongoose.connection.db.collection('lessons').insert({position: 2})
    await mongoose.connection.db.collection('lessons').insert({position: 1})
    await mongoose.connection.db.collection('lessons').insert({position: 3})
  })
  afterAll(async (done) => {
    await mongoose.connection.db.dropDatabase()
    done()
  })
  it('returns first lesson for a new user', async () => {
    const lesson = await resolvers.Query.Lesson(undefined, undefined, {Lessons: new LessonsRepository()})

    expect(lesson).toEqual(expect.objectContaining({position: 1}))
  })
  it('returns third lesson for a logged in user that already watched two lessons', async () => {
    const userId = mongoose.Types.ObjectId()
    await mongoose.connection.db.collection('userdetails').insert({userId, nextLessonPosition: 3})

    const context = {Lessons: new LessonsRepository(), user: {_id: userId}, UserDetails: new UserDetailsRepository()}
    const lesson = await resolvers.Query.Lesson(undefined, undefined, context)

    expect(lesson).toEqual(expect.objectContaining({position: 3}))
  })
})

describe('query.ItemsWithFlashcard', () => {
  afterAll(async (done) => {
    await mongoose.connection.db.dropDatabase()
    done()
  })

  it('returns 0 items for a new user without any lessons watched', async () => {
    const userId = mongoose.Types.ObjectId()
    const context = { user: { _id: userId }, ItemsWithFlashcard: new ItemsWithFlashcardRepository() }

    const items = await resolvers.Query.ItemsWithFlashcard(undefined, undefined, context)

    expect(items.length).toBe(0)
  })

  it('returns all available items for a new user after watching the first lesson', async () => {
    const userId = mongoose.Types.ObjectId()
    const context = { user: { _id: userId }, ItemsWithFlashcard: new ItemsWithFlashcardRepository() }
    const itemsToExtend = [
      { userId }, { userId }
    ]
    await makeItems({itemsToExtend})

    const items = await resolvers.Query.ItemsWithFlashcard(undefined, undefined, context)

    expect(items.length).toBe(itemsToExtend.length)
  })
})

describe('query.CurrentUser', () => {
  it('returns unchanged user from a context', () => {
    const context = deepFreeze({
      user: {_id: 'testId', email: 'test@email.com'}
    })

    const currentUser = resolvers.Query.CurrentUser(undefined, undefined, context)
    expect(currentUser).toEqual(context.user)
  })
})

describe('mutation.createItemsAndMarkLessonAsWatched', () => {
  let context
  beforeAll(async () => {
    // we have those in different order to make sure the query doesn't return the first inserted lesson.
    await mongoose.connection.db.collection('lessons').insert({position: 2})
    await mongoose.connection.db.collection('lessons').insert({position: 1})

    context = {
      user: {},
      Users: new UsersRepository(),
      UserDetails: new UserDetailsRepository(),
      Lessons: new LessonsRepository(),
      Items: new ItemsRepository(),
      req: {
        logIn: jest.fn()
      }
    }
  })
  afterAll(async (done) => {
    await mongoose.connection.db.dropDatabase()
    done()
  })
  it('returns the second lesson after watching the first one if you are a guest', async () => {
    const lesson = await resolvers.Mutation.createItemsAndMarkLessonAsWatched(undefined, undefined, context)

    expect(lesson.position).toBe(2)
  })
  it('returns the second lesson after watching the first one if you are a logged in user', async () => {
    const userId = mongoose.Types.ObjectId()
    await mongoose.connection.db.collection('userdetails').insert({userId, nextLessonPosition: 1})
    context.user = { _id: userId }

    const lesson = await resolvers.Mutation.createItemsAndMarkLessonAsWatched(undefined, undefined, context)

    expect(lesson.position).toBe(2)
  })
})

describe('mutation.processEvaluation', () => {
  let context
  beforeAll(async () => {
    context = {
      user: { _id: mongoose.Types.ObjectId() },
      Items: new ItemsRepository(),
      ItemsWithFlashcard: new ItemsWithFlashcardRepository()
    }
  })

  afterAll(async (done) => {
    await mongoose.connection.db.dropDatabase()
    done()
  })

  it('returns a correct item after "Wrong" evaluation', async () => {
    const userId = context.user._id
    const itemsToExtend = [
      { userId, _id: mongoose.Types.ObjectId() },
      { userId, _id: mongoose.Types.ObjectId() }
    ]

    await makeItems({ itemsToExtend })

    const args = {
      itemId: itemsToExtend[1]._id,
      evaluation: 2.5
    }

    const itemsWithFlashcard = await resolvers.Mutation.processEvaluation(undefined, args, context)
    const itemWithFlashcard = _.find(itemsWithFlashcard, (doc) => _.isEqual(doc.item._id, args.itemId))

    expect(itemWithFlashcard.item.actualTimesRepeated).toEqual(1)
  })
})

describe('login with facebook', async () => {
  it('returns user if it already exists', async () => {
    const {logInWithFacebook} = resolvers.Mutation
    const args = {
      accessToken: 'TOKEN'
    }

    const user = deepFreeze({username: 'test'})

    const context = {
      Users: {
        findByFacebookId: async () => (user)
      },
      req: {
        logIn: jest.fn()
      }
    }

    await logInWithFacebook(undefined, args, context)
    expect(context.req.logIn.mock.calls[0]).toContain(user)
  })
})
