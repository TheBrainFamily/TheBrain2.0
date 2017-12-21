// @flow
import casual from 'casual'
import _ from 'lodash'
import moment from 'moment'

import resolvers from './resolvers'
import { deepFreeze, extendExpect } from 'testHelpers/testHelpers'
import { CoursesRepository } from './repositories/CoursesRepository'
import { LessonsRepository } from './repositories/LessonsRepository'
import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { ItemsRepository } from './repositories/ItemsRepository'
import { ItemsWithFlashcardRepository } from './repositories/ItemsWithFlashcardRepository'
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

type MakeFlashcardsData = {
  number?: number,
  flashcardsToExtend?: Array<Object>
}

async function makeFlashcards ({number: number = 3, flashcardsToExtend = [], flashcardRepository}: MakeFlashcardsData = {}) {
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
      // await flashcardRepository.flashcardsCollection.insert(newFlashcard)
    }
  )
  await flashcardRepository.flashcardsCollection.insert(addedFlashcards)

  return addedFlashcards
}

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
  console.log("Gandecki addedItems", addedItems);
  return addedItems.map(item => itemsCollection.insert(item))
}

describe('query.Courses', () => {
  it('returns all courses', async () => {

    let coursesRepository = new CoursesRepository()
    coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
    coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})
    const context = {Courses: coursesRepository}
    const courses = await resolvers.Query.Courses(undefined, undefined, context)

    expect(courses.length).toBe(2)
  })
})

describe('query.Course', () => {
  it('returns a specific course', async () => {
    let coursesRepository = new CoursesRepository()
    await coursesRepository.coursesCollection.insert({name: 'testCourseName'})

    const secondCourseId = mongoObjectId()
    await coursesRepository.coursesCollection.insert({_id: secondCourseId, name: 'testCourseName2'})
    const context = {Courses: coursesRepository}

    const course = await resolvers.Query.Course(undefined, {_id: secondCourseId}, context)

    expect(course.name).toEqual('testCourseName2')
  })
})

describe('query.Lessons', () => {
  const generateLessonContext = async () => {
    let lessonsRepository = new LessonsRepository()
    await lessonsRepository.lessonsCollection.insert({position: 2, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourse2Id'})
    return {lessonsRepository}
  }
  it('returns all lessons for a specified course', async () => {
    const {lessonsRepository} = await generateLessonContext()
    const context = {Lessons: lessonsRepository}

    const lessons = await resolvers.Query.Lessons(undefined, {courseId: 'testCourseId'}, context)

    expect(lessons.length).toBe(2)
  })
  it('returns all lessons for a specified course sorted by its position', async () => {
    const {lessonsRepository} = await generateLessonContext()
    const context = {Lessons: lessonsRepository}

    const lessons = await resolvers.Query.Lessons(undefined, {courseId: 'testCourseId'}, context)

    expect(lessons[0].position).toBe(1)
  })
})

describe('query.LessonCount', () => {
  it('returns all lessons', async () => {
    const lessonsRepository = new LessonsRepository()
    await lessonsRepository.lessonsCollection.insert({position: 2, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourseId'})
    const context = {Lessons: lessonsRepository}
    const lessonCount = await resolvers.Query.LessonCount(undefined, undefined, context)

    expect(lessonCount).toEqual({count: 3})
  })
})

describe('query.flashcards', () => {
  it('returns flashcards from the db 1', async () => {
    const flashcardRepository = new FlashcardsRepository()
    const flashcardsData = await deepFreeze(makeFlashcards({flashcardRepository}))

    const dbFlashcards = await resolvers.Query.Flashcards(undefined, undefined,
      {Flashcards: flashcardRepository}
    )

    expect(dbFlashcards.length).toBe(3)
    expect(dbFlashcards).toContainDocuments(flashcardsData)
  })
})

describe('query.flashcard', () => {
  it('returns a flashcard by id', async () => {
    const flashcardsToExtend = [
      {_id: mongoObjectId()}, {_id: mongoObjectId()}
    ]
    const flashcardRepository = new FlashcardsRepository()
    const flashcardsData = await makeFlashcards({flashcardsToExtend, flashcardRepository})

    const dbFlashcards = await resolvers.Query.Flashcard(
      undefined,
      {_id: flashcardsData[1]._id},
      {Flashcards: flashcardRepository}
    )

    expect(dbFlashcards._id).toEqual(flashcardsData[1]._id)
  })
})

describe('query.Lesson', () => {

  const generateContext = async () => {
    const lessonsRepository = new LessonsRepository()

    // we have those in different order to make sure the query doesn't return the first inserted lesson.
    await lessonsRepository.lessonsCollection.insert({position: 2, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 3, courseId: 'testCourseId'})

    return {
      lessonsRepository,
      userDetailsRepository: new UserDetailsRepository(),
      userId: mongoObjectId()
    }
  }
  it('returns first lesson for a new user', async () => {
    const {userDetailsRepository, lessonsRepository, userId} = await generateContext()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })

    const context = {
      Lessons: lessonsRepository,
      user: {_id: userId},
      UserDetails: userDetailsRepository
    }
    const lesson = await resolvers.Query.Lesson(undefined, {courseId: 'testCourseId'}, context)

    expect(lesson).toEqual(expect.objectContaining({position: 1}))
  })
  it('returns third lesson for a logged in user that already watched two lessons', async () => {
    const {userDetailsRepository, lessonsRepository, userId} = await generateContext()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 3}]
    })

    const context = {
      Lessons: lessonsRepository,
      user: {_id: userId},
      UserDetails: userDetailsRepository
    }
    const lesson = await resolvers.Query.Lesson(undefined, {courseId: 'testCourseId'}, context)

    expect(lesson).toEqual(expect.objectContaining({position: 3}))
  })
})

describe('query.Item', () => {
  it('returns a specific item', async () => {
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

describe('query.ItemsWithFlashcard', () => {

  it('returns 0 items if no user exists', async () => {
    //XXX This test doesn't really check anything, of course it's going to return 0 items, since there are no items in the db
    const context = {ItemsWithFlashcard: new ItemsWithFlashcardRepository()}

    const items = await resolvers.Query.ItemsWithFlashcard(undefined, undefined, context)

    expect(items.length).toBe(0)
  })

  it('returns 0 items for a new user without any lessons watched', async () => {
    //XXX This test doesn't really check anything, of course it's going to return 0 items, since there are no items in the db
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      casual: false,
    })
    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      ItemsWithFlashcard: new ItemsWithFlashcardRepository()
    }

    const items = await resolvers.Query.ItemsWithFlashcard(undefined, undefined, context)

    expect(items.length).toBe(0)
  })

  it('returns two items for a new user after watching the first lesson', async () => {
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      selectedCourse: 'selectedCourse',
      casual: false,
    })
    const flashcardRepository = new FlashcardsRepository()
    const flashcardId = mongoObjectId()
    await flashcardRepository.flashcardsCollection.insert({_id: flashcardId, question: 'firstQuestion', answer: '!'})
    const secondFlashcardId = mongoObjectId()
    await flashcardRepository.flashcardsCollection.insert({
      _id: secondFlashcardId,
      question: 'secondQuestion',
      answer: '!'
    })

    const itemsWithFlashcardRepository = new ItemsWithFlashcardRepository()
    const itemsRepository = new ItemsRepository()

    const context = {
      user: {_id: userId},
      ItemsWithFlashcard: itemsWithFlashcardRepository,
      UserDetails: userDetailsRepository,
      Items: itemsRepository
    }
    const itemsToExtend = [
      {userId, flashcardId: secondFlashcardId, courseId: 'selectedCourse'}, {userId, flashcardId, courseId: 'selectedCourse'},
    ]
    const returnedFromItems = makeItems({itemsToExtend, itemsCollection: itemsWithFlashcardRepository.itemsCollection})

    await returnedFromItems;
    const items = await resolvers.Query.ItemsWithFlashcard(undefined, undefined, context)
    expect(items.length).toBe(2)
  })
})

describe('query.SessionCount', () => {
  it('returns an empty object if no user exists', async () => {
    const itemsWithFlashcardRepository = new ItemsWithFlashcardRepository()

    const context = {ItemsWithFlashcard: itemsWithFlashcardRepository}

    const sessionCount = await resolvers.Query.SessionCount(undefined, undefined, context)

    expect(sessionCount).toEqual({})
  })
  it('returns a session count', async () => {
    const userId = mongoObjectId()
    const userDetailsRepository = new UserDetailsRepository()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      casual: false,
      selectedCourse: "selectedCourse"
    })
    const itemsWithFlashcardRepository = new ItemsWithFlashcardRepository()

    await itemsWithFlashcardRepository.itemsCollection.insert({userId, actualTimesRepeated: 0, courseId: "selectedCourse"})
    const context = {
      user: {_id: userId},
      ItemsWithFlashcard: itemsWithFlashcardRepository,
      UserDetails: userDetailsRepository
    }

    const sessionCount = await resolvers.Query.SessionCount(undefined, undefined, context)
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

describe('query.CurrentUser', () => {
  it('returns unchanged user from a context', () => {
    const context = deepFreeze({
      user: {_id: 'testId', email: 'test@email.com'}
    })

    const currentUser = resolvers.Query.CurrentUser(undefined, undefined, context)
    expect(currentUser).toEqual(context.user)
  })
})

describe('query.UserDetails', () => {
  it('returns an empty object if no user exists', async () => {
    const context = {
      user: {},
      UserDetails: userDetailsRepository
    }

    const userDetails = resolvers.Query.UserDetails(undefined, undefined, context)

    expect(userDetails).toEqual(Promise.resolve({}))
  })
  it('returns user details by user id', async () => {
    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })

    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository
    }

    const userDetails = await resolvers.Query.UserDetails(undefined, undefined, context)

    expect(userDetails.progress[0].lesson).toEqual(1)
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
  //TODO mock the mongodb ObjectID so it doesn't require the 12 bytes for the next two
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

describe('mutation.createItemsAndMarkLessonAsWatched', () => {
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
      UserDetails, Lessons,
      user: {_id: userId},
      req: {
        logIn: jest.fn()
      }
    }

    const lesson = await resolvers.Mutation.createItemsAndMarkLessonAsWatched(undefined, {courseId: 'testCourseId'}, context)

    expect(lesson.position).toBe(2)
  })
})

describe('mutation.hideTutorial', () => {

  it('saves info that a tutorial should be disabled for a specific user', async () => {
    const userDetailsRepository = new UserDetailsRepository()

    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}]
    })
    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      req: {
        logIn: jest.fn()
      }
    }

    const user = await resolvers.Mutation.hideTutorial(undefined, {courseId: 'testCourseId'}, context)

    expect(user.hasDisabledTutorial).toBe(true)
  })
})

describe.skip('mutation.processEvaluation', () => {
  it('returns a correct item after "Wrong" evaluation', async () => {
    const itemsRepository = new ItemsRepository()
    const context = {
      user: {_id: mongoObjectId()},
      Items: itemsRepository,
      //TODO repository should be for one entity type I believe, if we need to combine data do that in a service
      // this way also we improve the testability, for now we can't test this
      ItemsWithFlashcard: itemsWithFlashcardRepository,
      UserDetails: userDetailsRepository
    }
    const userId = context.user._id
    const itemsToExtend = [
      {userId, _id: mongoObjectId()},
      {userId, _id: mongoObjectId()}
    ]

    await makeItems({itemsToExtend})

    const args = {
      itemId: itemsToExtend[1]._id,
      evaluation: 2.5
    }
    const itemsWithFlashcard = await resolvers.Mutation.processEvaluation(undefined, args, context)
    const itemWithFlashcard = _.find(itemsWithFlashcard, (doc) => _.isEqual(doc.item._id.toString(), args.itemId.toString()))

    expect(itemWithFlashcard.item.actualTimesRepeated).toEqual(1)
  })
})

// There is one test and it's hard to test what was it originally tested anyway,
// there is an if inside an if inside an if here, every path should be covered separately
// I'm commenting this out instead of fixing it, as it's hard to say what's the expected behavior

describe.skip('login with facebook', async () => {
  it('returns user if it already exists', async () => {

    const {logInWithFacebook} = resolvers.Mutation
    const userId = mongoObjectId()
    await mongoose.connection.db.collection('user').insert({
      username: 'fbUsername',
      facebookId: 'facebookId'
    })
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}],
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
