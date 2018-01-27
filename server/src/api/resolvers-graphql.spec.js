import _ from 'lodash'
import gql from 'graphql-tag'
import moment from 'moment'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { UserDetailsRepository } from './repositories/UserDetailsRepository'
import { ItemsRepository } from './repositories/ItemsRepository'
import schema from './schema'
import { CoursesRepository } from './repositories/CoursesRepository'
import { LessonsRepository } from './repositories/LessonsRepository'
import { deepFreeze, extendExpect } from '../testHelpers/testHelpers'
import { makeFlashcards } from '../testHelpers/makeFlashcards'
import { mongoObjectId } from '../testHelpers/mongoObjectId'
import { makeItems } from '../testHelpers/makeItems'
import { UsersRepository } from './repositories/UsersRepository'

extendExpect()

describe('Query: Courses', () => {
  it('returns all courses', async () => {
    const coursesRepository = new CoursesRepository()
    coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
    coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})
    const context = {Courses: coursesRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              Courses {
                  _id
                  name
                  color
                  isDisabled
              }
          }
      `
      }))
    const courses = result.data.Courses

    expect(courses.length).toBe(2)
  })
})
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
describe('Query: Course', () => {
  it('returns a specific course', async () => {
    let coursesRepository = new CoursesRepository()
    await coursesRepository.coursesCollection.insert({_id: 'id', name: 'testCourseName'})

    const secondCourseId = mongoObjectId()
    await coursesRepository.coursesCollection.insert({_id: secondCourseId, name: 'testCourseName2'})
    const context = {Courses: coursesRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query ($secondCourseId: String!) {
              Course(_id:$secondCourseId) {
                  _id
                  name
                  color
                  isDisabled
              }
          },
      `,
        variables: {secondCourseId}
      }))
    const course = result.data.Course

    expect(course.name).toEqual('testCourseName2')
  })
})
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
describe('Query: Lesson', () => {
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

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query ($courseId: String!) {
              Lesson(courseId:$courseId) {
                  _id
                  position
              }
          },
      `,
        variables: {courseId: 'testCourseId'}
      }))
    const lesson = result.data.Lesson

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

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query ($courseId: String!) {
              Lesson(courseId:$courseId) {
                  _id
                  position
              }
          },
      `,
        variables: {courseId: 'testCourseId'}
      }))
    const lesson = result.data.Lesson

    expect(lesson).toEqual(expect.objectContaining({position: 3}))
  })
})
describe('Query: Lessons', () => {
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

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query ($courseId: String!) {
              Lessons(courseId:$courseId) {
                  _id
              }
          },
      `,
        variables: {courseId: 'testCourseId'}
      }))
    const lessons = result.data.Lessons

    expect(lessons.length).toBe(2)
  })
  it('returns all lessons for a specified course sorted by its position', async () => {
    const {lessonsRepository} = await generateLessonContext()
    const context = {Lessons: lessonsRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query ($courseId: String!) {
              Lessons(courseId:$courseId) {
                  _id
                  position
              }
          },
      `,
        variables: {courseId: 'testCourseId'}
      }))
    const lessons = result.data.Lessons

    expect(lessons[0].position).toBe(1)
  })
})
describe('Query: LessonCount', () => {
  it('returns all lessons', async () => {
    const lessonsRepository = new LessonsRepository()
    await lessonsRepository.lessonsCollection.insert({position: 2, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourseId'})
    await lessonsRepository.lessonsCollection.insert({position: 1, courseId: 'testCourseId'})
    const context = {Lessons: lessonsRepository}

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              LessonCount {
                  count
              }
          },
      `,
        variables: {courseId: 'testCourseId'}
      }))
    const lessonCount = result.data.LessonCount

    expect(lessonCount).toEqual({count: 3})
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
describe('Query: CurrentUser', () => {
  it('returns unchanged user from a context', async () => {
    const context = deepFreeze({
      user: {_id: 'testId', email: 'test@email.com'}
    })

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              CurrentUser {
                  _id
                  email
              }
          }
      `
      }))
    const currentUser = result.data.CurrentUser

    expect(currentUser).toEqual(context.user)
  })
})
describe('Query: UserDetails', () => {
  it('returns an empty object if no user exists', async () => {
    const userDetailsRepository = new UserDetailsRepository()
    const context = {
      user: {},
      UserDetails: userDetailsRepository
    }

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              UserDetails {
                  hasDisabledTutorial
                  selectedCourse
                  isCasual
              }
          }
      `
      }))
    const userDetails = result.data.UserDetails

    expect(userDetails).toEqual({'hasDisabledTutorial': null, 'isCasual': null, 'selectedCourse': null})
  })
  it('returns user details by user id', async () => {
    const userDetailsRepository = new UserDetailsRepository()

    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      selectedCourse: 'testCourse',
      hasDisabledTutorial: true
    })

    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository
    }

    let result = (await mockNetworkInterfaceWithSchema({schema, context})
      .query({
        query: gql`
          query {
              UserDetails {
                  hasDisabledTutorial
                  selectedCourse
              }
          }
      `
      }))
    const userDetails = result.data.UserDetails

    expect(userDetails).toEqual({selectedCourse: 'testCourse', hasDisabledTutorial: true})
  })
})

describe('Mutation: selectCourse', () => {
  let context = null
  beforeEach(async () => {
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
  it('saves info about a course selected if no user exists', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation selectCourse($courseId: String!) {
              selectCourse(courseId: $courseId) {
                  hasDisabledTutorial
                  selectedCourse
                  experience {
                      value
                      level
                      showLevelUp
                  }
                  isCasual
              }
          },
      `,
      variables: {courseId: 'testCourseId'}
    })
    const {selectCourse: result} = data

    const userDetailsDbo = await context.UserDetails.userDetailsCollection.findOne()
    expect(userDetailsDbo.selectedCourse).toEqual('testCourseId')
    expect(context.req.logIn.mock.calls.length).toEqual(1)
    expect(result.selectedCourse).toEqual('testCourseId')
    expect(result.experience).toEqual({value: 0, level: 0, showLevelUp: null})
  })
  it('saves info about a course selected by a user', async () => {
    const userId = mongoObjectId()
    await context.UserDetails.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}],
      experience: {
        value: 1,
        level: 1
      }
    })
    context.user = {_id: userId}

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation selectCourse($courseId: String!) {
              selectCourse(courseId: $courseId) {
                  hasDisabledTutorial
                  selectedCourse
                  experience {
                      value
                      level
                      showLevelUp
                  }
                  isCasual
              }
          },
      `,
      variables: {courseId: 'testCourseId'}
    })
    const {selectCourse: result} = data

    const userDetailsDbo = await context.UserDetails.userDetailsCollection.findOne()
    expect(userDetailsDbo.selectedCourse).toEqual('testCourseId')
    expect(context.req.logIn.mock.calls.length).toEqual(0)
    expect(result.selectedCourse).toEqual('testCourseId')
    expect(result.experience).toEqual({value: 1, level: 1, showLevelUp: null})
  })
})
describe('Mutation: selectCourseSaveToken', () => {
  let context = null
  beforeEach(async () => {
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
  it('saves info about a course selected if no user exists', async () => {
    const deviceId = 'testDeviceId'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {data} = await networkInterface.query({
      query: gql`
          mutation selectCourseSaveToken($courseId: String!, $deviceId: String) {
              selectCourseSaveToken(courseId: $courseId, deviceId: $deviceId) {
                  hasDisabledTutorial
                  selectedCourse
                  experience {
                      value
                      level
                      showLevelUp
                  }
                  isCasual
              }
          },
      `,
      variables: {courseId: 'testCourseId', deviceId}
    })
    const {selectCourseSaveToken: result} = data

    expect(context.req.logIn.mock.calls.length).toEqual(1)
    expect(context.req.logIn.mock.calls[0][0].currentAccessToken).toBeTruthy()
    expect(result.selectedCourse).toEqual('testCourseId')
    expect(result.experience).toEqual({value: 0, level: 0, showLevelUp: null})
  })
  it('saves info about a course selected by a user', async () => {
    const userId = mongoObjectId()
    await context.UserDetails.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}],
      experience: {
        value: 1,
        level: 1
      }
    })
    context.user = {_id: userId}

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation selectCourseSaveToken($courseId: String!, $deviceId: String) {
              selectCourseSaveToken(courseId: $courseId, deviceId: $deviceId) {
                  hasDisabledTutorial
                  selectedCourse
                  experience {
                      value
                      level
                      showLevelUp
                  }
                  isCasual
              }
          },
      `,
      variables: {courseId: 'testCourseId', deviceId: 'testDeviceId'}
    })
    const {selectCourseSaveToken: result} = data

    const userDetailsDbo = await context.UserDetails.userDetailsCollection.findOne()
    expect(userDetailsDbo.selectedCourse).toEqual('testCourseId')
    expect(context.req.logIn.mock.calls.length).toEqual(0)
    expect(result.selectedCourse).toEqual('testCourseId')
    expect(result.experience).toEqual({value: 1, level: 1, showLevelUp: null})
  })
})
describe('Mutation: closeCourse', () => {
  it('closes users current course', async () => {
    const coursesRepository = new CoursesRepository()
    await coursesRepository.coursesCollection.insert({_id: 'testCourseId'})
    const usersRepository = new UsersRepository()
    const userDetailsRepository = new UserDetailsRepository()
    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      progress: [{courseId: 'testCourseId', lesson: 1}],
      experience: {
        value: 1,
        level: 1
      },
      selectedCourse: 'testCourseId'
    })

    const context = {
      user: {_id: userId},
      Users: usersRepository,
      UserDetails: userDetailsRepository,
      req: {
        logIn: jest.fn()
      }
    }

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation closeCourse {
              closeCourse {
                  hasDisabledTutorial
                  selectedCourse
                  experience {
                      value
                      level
                      showLevelUp
                  }
                  isCasual
              }
          },
      `
    })
    const {closeCourse: result} = data

    const userDetailsDbo = await context.UserDetails.userDetailsCollection.findOne()
    expect(userDetailsDbo.selectedCourse).toBeFalsy()
    expect(context.req.logIn.mock.calls.length).toEqual(0)
    expect(result.selectedCourse).toBeFalsy()
    expect(result.experience).toEqual({value: 1, level: 1, showLevelUp: null})
  })
})
describe('Mutation: createItemsAndMarkLessonAsWatched', () => {
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
describe('Mutation: hideTutorial', () => {
  it('saves info that a tutorial should be disabled for a specific user', async () => {
    const userDetailsRepository = new UserDetailsRepository()

    const userId = mongoObjectId()
    await userDetailsRepository.userDetailsCollection.insert({
      userId,
      selectedCourse: 'testCourseId'
    })
    const context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      req: {
        logIn: jest.fn()
      }
    }
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    await networkInterface.query({
      query: gql`
          mutation  {
              hideTutorial {
                  hasDisabledTutorial
              }
          },
      `,
      variables: {courseId: 'testCourseId'}
    })

    let result = await networkInterface.query({
      query: gql`
          query {
              UserDetails {
                  hasDisabledTutorial
                  selectedCourse
                  isCasual
              }
          }
      `
    })
    const userDetails = result.data.UserDetails

    expect(userDetails.hasDisabledTutorial).toBe(true)
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
