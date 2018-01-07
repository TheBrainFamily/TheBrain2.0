import casual from 'casual'
import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import _ from 'lodash'
import { FlashcardsRepository } from './repositories/FlashcardsRepository'
import { UserDetailsRepository } from './repositories/UserDetailsRepository'
import { ItemsRepository } from './repositories/ItemsRepository'
import schema from './schema'
import { CoursesRepository } from './repositories/CoursesRepository'
import resolvers from './resolvers'

// TODO extract the common functionality to a test helper
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

describe('Courses query', ()=> {
  it('returns all courses', async () => {
    const coursesRepository = new CoursesRepository()
    coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
    coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})
    const context = {Courses: coursesRepository}
    // const courses = await resolvers.Query.Courses(undefined, undefined, context)

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
