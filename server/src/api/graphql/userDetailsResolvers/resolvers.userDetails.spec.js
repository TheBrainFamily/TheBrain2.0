import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { UserDetailsRepository } from '../../repositories/UserDetailsRepository'
import schema from '../schema'
import { mongoObjectId } from '../../../testHelpers/mongoObjectId'

describe('Query: UserDetails', () => {
  it('returns an empty object if no user exists', async () => {
    const context = {
      user: {}
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
// TODO: restore when tingodb is updated with new mongo api
describe.skip('Mutation: confirmLevelUp', () => {
  let context = null
  const userId = mongoObjectId()
  beforeEach(() => {
    const userDetailsRepository = new UserDetailsRepository()
    userDetailsRepository.userDetailsCollection.insert({
      userId,
      experience: {
        showLevelUp: true
      }
    })
    context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository
    }
  })
  it('resets level up flag', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation confirmLevelUp {
              confirmLevelUp {
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
    const {confirmLevelUp: serverResponse} = data
    expect(serverResponse).toBeTruthy()
    expect(serverResponse.experience.showLevelUp).toEqual(false)
  })
})
describe('Mutation: switchUserIsCasual', () => {
  let context = null
  const userId = mongoObjectId()
  beforeEach(() => {
    const userDetailsRepository = new UserDetailsRepository()
    context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      req: {
        logOut: jest.fn()
      }
    }
  })
  it('switches user to casual mode', async () => {
    const isCasual = false
    context.UserDetails.userDetailsCollection.insert({
      userId,
      isCasual,
      hasDisabledTutorial: false,
      selectedCourse: ''
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation switchUserIsCasual {
              switchUserIsCasual {
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
    const {switchUserIsCasual: serverResponse} = data

    expect(serverResponse).toBeTruthy()
    expect(serverResponse.isCasual).toEqual(!isCasual)
  })
})
describe('Mutation: setUserIsCasual', () => {
  let context = null
  const userId = mongoObjectId()
  beforeEach(() => {
    const userDetailsRepository = new UserDetailsRepository()
    context = {
      user: {_id: userId},
      UserDetails: userDetailsRepository,
      req: {
        logOut: jest.fn()
      }
    }
  })
  it('switches user to casual mode', async () => {
    const isCasual = false
    context.UserDetails.userDetailsCollection.insert({
      userId,
      isCasual,
      hasDisabledTutorial: false,
      selectedCourse: ''
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation setUserIsCasual($isCasual: Boolean!) {
              setUserIsCasual(isCasual: $isCasual) {
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
      variables: {isCasual: true}
    })
    const {setUserIsCasual: serverResponse} = data

    expect(serverResponse).toBeTruthy()
    expect(serverResponse.isCasual).toEqual(true)
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
