import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import schema from '../schema'
import { CoursesRepository } from '../../repositories/CoursesRepository'
import { mongoObjectId } from '../../../testHelpers/mongoObjectId'
import { UserDetailsRepository } from '../../repositories/UserDetailsRepository'
import { UsersRepository } from '../../repositories/UsersRepository'

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
