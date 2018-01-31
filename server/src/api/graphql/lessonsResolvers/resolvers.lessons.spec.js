import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { UserDetailsRepository } from '../../repositories/UserDetailsRepository'
import { LessonsRepository } from '../../repositories/LessonsRepository'
import schema from '../schema'
import { mongoObjectId } from '../../../testHelpers/mongoObjectId'

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
