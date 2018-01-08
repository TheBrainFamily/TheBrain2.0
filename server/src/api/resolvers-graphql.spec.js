import casual from 'casual'
import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import _ from 'lodash'
import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { UserDetailsRepository } from './repositories/UserDetailsRepository'
import { ItemsRepository } from './repositories/ItemsRepository'
import schema from './schema'
import { CoursesRepository } from './repositories/CoursesRepository'
import {LessonsRepository} from "./repositories/LessonsRepository";
import { deepFreeze, extendExpect } from '../testHelpers/testHelpers'
import resolvers from "./resolvers";

extendExpect();

// TODO extract the common functionality to a test helper
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

type MakeFlashcardsData = {
  number?: number,
  flashcardsToExtend?: Array<Object>
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

describe('Courses query', ()=> {
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
    const courses = result.data.Courses;

    expect(courses.length).toBe(2)
  })
})

describe('query.Course', () => {
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
    const course = result.data.Course;

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
		const lessons = result.data.Lessons;

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
		const lessons = result.data.Lessons;

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
    const lessonCount = result.data.LessonCount;

    expect(lessonCount).toEqual({count: 3})
  })
})
describe('query.flashcards', () => {
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
      `,
    }))
    const dbFlashcards = result.data.Flashcards;

    // WHY: _id is a string in response from GraphQL
    // Expected value to be (using ===):
    // [{"_id": 2, "answer": "Consectetur qua
    //   Received:
    //     [{"_id": "2", "answer": "Consectetur q

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
		const dbFlashcard = result.data.Flashcard;

		expect(dbFlashcard._id).toEqual(flashcardsData[1]._id)
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
		const lesson = result.data.Lesson;

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
		const lesson = result.data.Lesson;

		expect(lesson).toEqual(expect.objectContaining({position: 3}))
	})
})


describe('Items query', async() => {
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
      {userId, flashcardId: secondFlashcardId, courseId: 'selectedCourse'}, {userId, flashcardId, courseId: 'selectedCourse'}
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

describe('query.SessionCount', () => {
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
		const sessionCount = result.data.SessionCount;

		expect(sessionCount).toEqual({newDone: null, newTotal: null, dueDone: null, dueTotal: null, reviewDone: null, reviewTotal: null})
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
		const sessionCount = result.data.SessionCount;

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