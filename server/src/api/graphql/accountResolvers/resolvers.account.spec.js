import moment from 'moment'
import gql from 'graphql-tag'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context'
import { UserDetailsRepository } from '../../repositories/UserDetailsRepository'
import { UsersRepository } from '../../repositories/UsersRepository'
import schema from '../schema'
import fetch from 'node-fetch'
import { mongoObjectId } from '../../../testHelpers/mongoObjectId'
import { deepFreeze } from '../../../testHelpers/testHelpers'

jest.mock('../../../configuration/common', () => {
  return {
    facebookAppId: 'MOCKED_FB_APP_ID',
    renewTokenOnLogin: true
  }
})
jest.mock('node-fetch', () => {
  return jest.fn()
})
jest.mock('bcryptjs', () => {
  return {
    genSalt: jest.fn().mockImplementation(() => 'MOCK_SALT'),
    hash: jest.fn().mockImplementation(() => 'MOCK_HASH'),
    compare: jest.fn().mockImplementation((a, b) => a === b)
  }
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
describe('Mutation: logInWithFacebookAccessToken & logInWithFacebook', () => {
  let context = null
  beforeEach(async () => {
    fetch.mockClear()
    fetch.mockImplementation(async (query) => {
      if (query.includes(`https://graph.facebook.com/me?access_token=correctAccessToken`)) {
        return {
          json: () => ({id: 'testFbUserId'})
        }
      }
      if (query.includes(`https://graph.facebook.com/app/?access_token=correctAccessToken`)) {
        return {
          json: () => ({id: 'MOCKED_FB_APP_ID'})
        }
      }
      if (query.includes(`https://graph.facebook.com/v2.10/`)) {
        return {
          json: () => ({id: 'testFbUserId', name: 'testUserName', email: 'test@thebrain.pro'})
        }
      }
      return {
        json: () => ({id: 'MOCK'})
      }
    })

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

  it('logs in user with correct accessTokenFb', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {data} = await networkInterface.query({
      query: gql`
          mutation logInWithFacebookAccessToken($accessTokenFb: String)  {
              logInWithFacebookAccessToken(accessTokenFb:$accessTokenFb) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {accessTokenFb: 'correctAccessToken'}
    })

    const {logInWithFacebookAccessToken: serverResponse} = data
    expect(context.req.logIn).toHaveBeenCalledTimes(1)
    expect(serverResponse.username).toEqual('testUserName')
    expect(serverResponse.email).toEqual('test@thebrain.pro')
  })
  it('doesn\'t login user with incorrect accessTokenFb', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {errors} = await networkInterface.query({
      query: gql`
          mutation logInWithFacebookAccessToken($accessTokenFb: String)  {
              logInWithFacebookAccessToken(accessTokenFb:$accessTokenFb) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {accessTokenFb: 'invalidToken'}
    })

    expect(context.req.logIn).toHaveBeenCalledTimes(0)
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Facebook access token app id mismatch, tokenAppId: MOCK facebookConfig.appId: MOCKED_FB_APP_ID')
  })
  it('logs in user with correct accessToken and userId', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {data} = await networkInterface.query({
      query: gql`
          mutation logInWithFacebook($accessTokenFb: String!, $userIdFb: String!)  {
              logInWithFacebook(accessTokenFb:$accessTokenFb, userIdFb: $userIdFb) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {accessTokenFb: 'correctAccessToken', userIdFb: 'testFbUserId'}
    })

    const {logInWithFacebook: serverResponse} = data
    expect(context.req.logIn).toHaveBeenCalledTimes(1)
    expect(serverResponse.username).toEqual('testUserName')
    expect(serverResponse.email).toEqual('test@thebrain.pro')
  })
  it('doesn\'t login user with incorrect accessTokenFb', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {errors} = await networkInterface.query({
      query: gql`
          mutation logInWithFacebook($accessTokenFb: String!, $userIdFb: String!)  {
              logInWithFacebook(accessTokenFb:$accessTokenFb, userIdFb: $userIdFb) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {accessTokenFb: 'invalidAccessToken', userIdFb: 'testFbUserId'}
    })

    expect(context.req.logIn).toHaveBeenCalledTimes(0)
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Facebook access token app id mismatch, tokenAppId: MOCK facebookConfig.appId: MOCKED_FB_APP_ID')
  })
  it('doesn\'t login user with incorrect userId', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})

    const {errors} = await networkInterface.query({
      query: gql`
          mutation logInWithFacebook($accessTokenFb: String!, $userIdFb: String!)  {
              logInWithFacebook(accessTokenFb:$accessTokenFb, userIdFb: $userIdFb) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {accessTokenFb: 'correctAccessToken', userIdFb: 'invalidUserFbId'}
    })

    expect(context.req.logIn).toHaveBeenCalledTimes(0)
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Invalid facebook response')
  })
  it('existing user logs in user with correct accessToken and userId', async () => {
    const userId = mongoObjectId()
    context.user = {_id: userId}
    context.Users.userCollection.insert({_id: userId, facebookId: 'testFbUserId', password: ''})
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation logInWithFacebook($accessTokenFb: String!, $userIdFb: String!)  {
              logInWithFacebook(accessTokenFb:$accessTokenFb, userIdFb: $userIdFb) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {accessTokenFb: 'correctAccessToken', userIdFb: 'testFbUserId'}
    })
    const {logInWithFacebook: serverResponse} = data
    expect(context.req.logIn).toHaveBeenCalledTimes(1)
    expect(serverResponse._id).toEqual(userId)
    expect(serverResponse.username).toEqual('testUserName')
    expect(serverResponse.email).toEqual('test@thebrain.pro')
  })
})
describe('Mutation: logIn', () => {
  let context = null
  beforeEach(() => {
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
  it('logs in user if correct parameters are passed', async () => {
    const userId = mongoObjectId()
    const deviceId = 'correctDeviceId'
    context.Users.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: 'correctPassword',
      activated: 'false'
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean)  {
              logIn(username:$username, password: $password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username: 'correctUserName', password: 'correctPassword', deviceId, saveToken: true}
    })

    const {logIn: serverResponse} = data
    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeTruthy()
    expect(authToken.userId).toEqual(userId)
    expect(authToken.deviceId).toEqual(deviceId)
    expect(authToken.token).toEqual('MOCK_HASH')
    expect(serverResponse).toBeTruthy()
    expect(serverResponse._id).toEqual(userId)
    expect(serverResponse.currentAccessToken).toEqual('MOCK_HASH')
  })
  it('does not log in user if incorrect password is passed', async () => {
    const userId = mongoObjectId()
    const deviceId = 'correctDeviceId'
    context.Users.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: '$2a$10$x/TfI44OnblUFmlkFMsdXu.5PfkF44OsntYBhoaI9Z8aqJw.DMYUa',
      activated: 'false'
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean)  {
              logIn(username:$username, password: $password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username: 'correctUserName', password: 'inCorrectPassword', deviceId, saveToken: true}
    })

    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeFalsy()
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Wrong username or password')
  })
  it('does not log in user if incorrect username is passed', async () => {
    const userId = mongoObjectId()
    const deviceId = 'correctDeviceId'
    context.Users.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: '$2a$10$x/TfI44OnblUFmlkFMsdXu.5PfkF44OsntYBhoaI9Z8aqJw.DMYUa',
      activated: 'false'
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean)  {
              logIn(username:$username, password: $password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username: 'inCorrectUserName', password: 'correctPassword', deviceId, saveToken: true}
    })

    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeFalsy()
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('User not found')
  })
})
describe('Mutation: logInWithToken', () => {
  let context = null
  beforeEach(() => {
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
  it('logs in user if correct parameters are passed', async () => {
    const userId = mongoObjectId()
    const deviceId = 'correctDeviceId'
    const accessToken = 'correctAccessToken'
    context.Users.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: '',
      activated: 'false'
    })
    context.Users.authTokenCollection.insert({
      userId,
      token: accessToken,
      deviceId,
      createdAt: moment().unix()
    })

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation logInWithToken($userId: String!, $accessToken: String!, $deviceId: String!)  {
              logInWithToken(userId:$userId, accessToken: $accessToken, deviceId:$deviceId) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {userId, accessToken, deviceId}
    })

    const {logInWithToken: serverResponse} = data
    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeTruthy()
    expect(authToken.userId).toEqual(userId)
    expect(authToken.deviceId).toEqual(deviceId)
    expect(authToken.token).toEqual('MOCK_HASH')
    expect(serverResponse).toBeTruthy()
    expect(serverResponse._id).toEqual(userId)
    expect(serverResponse.currentAccessToken).toEqual('MOCK_HASH')
  })
  it('does not log in user if incorrect accessToken is passed', async () => {
    const userId = mongoObjectId()
    const deviceId = 'correctDeviceId'
    const accessToken = 'correctAccessToken'
    context.Users.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: '',
      activated: 'false'
    })
    context.Users.authTokenCollection.insert({
      userId,
      token: accessToken,
      deviceId,
      createdAt: moment().unix()
    })

    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation logInWithToken($userId: String!, $accessToken: String!, $deviceId: String!)  {
              logInWithToken(userId:$userId, accessToken: $accessToken, deviceId:$deviceId) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {userId, accessToken: 'incorrectAccessToken', deviceId}
    })

    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeTruthy()
    expect(authToken.userId).toEqual(userId)
    expect(authToken.deviceId).toEqual(deviceId)
    expect(authToken.token).toEqual(accessToken)
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Token expired')
  })
  it('does not log in user if incorrect username is passed', async () => {
    const userId = mongoObjectId()
    const deviceId = 'correctDeviceId'
    context.Users.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: '$2a$10$x/TfI44OnblUFmlkFMsdXu.5PfkF44OsntYBhoaI9Z8aqJw.DMYUa',
      activated: 'false'
    })
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation logIn($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean)  {
              logIn(username:$username, password: $password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  password
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username: 'inCorrectUserName', password: 'correctPassword', deviceId, saveToken: true}
    })

    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeFalsy()
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('User not found')
  })
})
describe('Mutation: logOut', () => {
  let context = null
  beforeEach(() => {
    const usersRepository = new UsersRepository()
    const userDetailsRepository = new UserDetailsRepository()
    const userId = mongoObjectId()
    const accessToken = 'correctAccessToken'
    const deviceId = 'correctDeviceId'
    usersRepository.userCollection.insert({
      _id: userId,
      username: 'correctUserName',
      password: '',
      activated: 'false'
    })
    usersRepository.authTokenCollection.insert({
      userId,
      token: accessToken,
      deviceId,
      createdAt: moment().unix()
    })
    context = {
      user: {_id: userId, currentAccessToken: accessToken},
      Users: usersRepository,
      UserDetails: userDetailsRepository,
      req: {
        logOut: jest.fn()
      }
    }
  })
  it('logs in user if correct parameters are passed', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation logOut {
              logOut {
                  _id
                  username
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `
    })
    const {logOut: serverResponse} = data
    const authToken = await context.Users.authTokenCollection.findOne()

    expect(authToken).toBeFalsy()
    expect(serverResponse).toBeTruthy()
    expect(serverResponse._id).toEqual('loggedOut')
  })
})
describe('Mutation: setUsernameAndPasswordForGuest', () => {
  let context = null
  const userId = mongoObjectId()
  beforeEach(() => {
    const usersRepository = new UsersRepository()
    usersRepository.userCollection.insert({
      _id: userId,
      username: '',
      password: ''
    })

    context = {
      Users: usersRepository,
      req: {
        logIn: jest.fn()
      }
    }
  })
  it('assign username and password to guest user', async () => {
    const username = 'testUsername'
    const password = 'MOCK_HASH'
    const deviceId = 'correctDeviceId'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean) {
              setUsernameAndPasswordForGuest(username: $username, password:$password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  username
                  password
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username, password, deviceId, saveToken: true}
    })

    const {setUsernameAndPasswordForGuest: serverResponse} = data

    expect(serverResponse).toBeTruthy()
    expect(serverResponse.username).toEqual(username)
    expect(serverResponse.password).toEqual(password)
    expect(context.req.logIn).toHaveBeenCalledTimes(2)
  })
  it('fails if username is not unique', async () => {
    const username = 'testUsername'
    context.Users.userCollection.insert({
      _id: mongoObjectId(),
      username: username
    })
    const password = 'MOCK_HASH'
    const deviceId = 'correctDeviceId'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean) {
              setUsernameAndPasswordForGuest(username: $username, password:$password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  username
                  password
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username, password, deviceId, saveToken: true}
    })
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Username is already taken')
  })
  it('fails if username is empty', async () => {
    const username = ''
    const password = 'MOCK_HASH'
    const deviceId = 'correctDeviceId'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean) {
              setUsernameAndPasswordForGuest(username: $username, password:$password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  username
                  password
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username, password, deviceId, saveToken: true}
    })
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Username and password cannot be empty')
  })
  it('fails if password is empty', async () => {
    const username = 'testUsername'
    const password = ''
    const deviceId = 'correctDeviceId'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation setUsernameAndPasswordForGuest($username: String!, $password: String!, $deviceId: String!, $saveToken: Boolean) {
              setUsernameAndPasswordForGuest(username: $username, password:$password, deviceId:$deviceId, saveToken:$saveToken) {
                  _id
                  username
                  password
                  email
                  activated
                  facebookId
                  currentAccessToken
              }
          },
      `,
      variables: {username, password, deviceId, saveToken: true}
    })
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Username and password cannot be empty')
  })
})
describe('Mutation: clearToken', () => {
  let context = null
  const userId = mongoObjectId()
  const token = 'userToken'
  beforeEach(() => {
    const usersRepository = new UsersRepository()
    usersRepository.authTokenCollection.insert({
      userId,
      token
    })
    context = {
      Users: usersRepository
    }
  })
  it('assign username and password to guest user', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation clearToken($userId: String!, $token: String!) {
              clearToken(userId: $userId, token: $token)
          },
      `,
      variables: {userId, token}
    })

    const {clearToken: serverResponse} = data
    const authTokens = await context.Users.authTokenCollection.find().toArray()
    expect(serverResponse).toBeTruthy()
    expect(authTokens.length).toEqual(0)
  })
  it('doesn\'t remove anything if incorrect token is passed', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation clearToken($userId: String!, $token: String!) {
              clearToken(userId: $userId, token: $token)
          },
      `,
      variables: {userId, token: 'incorrectToken'}
    })

    const {clearToken: serverResponse} = data
    const authTokens = await context.Users.authTokenCollection.find().toArray()
    expect(serverResponse).toBeTruthy()
    expect(authTokens.length).toEqual(1)
  })
})
describe('Mutation: resetPassword', () => {
  let context = null
  const userId = mongoObjectId()
  beforeEach(() => {
    const usersRepository = new UsersRepository()
    usersRepository.userCollection.insert({
      _id: userId,
      username: 'testUsername'
    })
    context = {
      user: {},
      Users: usersRepository,
      req: {
        logIn: jest.fn()
      }
    }
  })
  it('resets users password', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation resetPassword($username: String!)  {
              resetPassword(username:$username) {
                  success
              }
          },
      `,
      variables: {username: 'testUsername'}
    })

    const {resetPassword: serverResponse} = data
    expect(serverResponse).toBeTruthy()
    expect(serverResponse.success).toEqual(true)
  })
  it('doesn\'t reset users password if incorrect username is passed', async () => {
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation resetPassword($username: String!)  {
              resetPassword(username:$username) {
                  success
              }
          },
      `,
      variables: {username: 'incorrectUsername'}
    })

    const {resetPassword: serverResponse} = data
    expect(serverResponse).toBeTruthy()
    expect(serverResponse.success).toEqual(false)
  })
})
describe('Mutation: changePassword', () => {
  let context = null
  const userId = mongoObjectId()
  beforeEach(() => {
    const usersRepository = new UsersRepository()
    usersRepository.userCollection.insert({
      _id: userId,
      username: 'testUsername',
      password: 'oldPassword'
    })
    context = {
      user: {_id: userId},
      Users: usersRepository
    }
  })
  it('changes users password', async () => {
    const oldPassword = 'oldPassword'
    const newPassword = 'newPassword'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {data} = await networkInterface.query({
      query: gql`
          mutation changePassword($oldPassword: String!, $newPassword: String!)  {
              changePassword(oldPassword:$oldPassword, newPassword:$newPassword) {
                  success
              }
          },
      `,
      variables: {oldPassword, newPassword}
    })

    const {changePassword: serverResponse} = data
    expect(serverResponse).toBeTruthy()
    expect(serverResponse.success).toEqual(true)
  })
  it('doesn\'t change users password if incorrect old password is passed', async () => {
    const oldPassword = 'incorrectPassword'
    const newPassword = 'newPassword'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation changePassword($oldPassword: String!, $newPassword: String!)  {
              changePassword(oldPassword:$oldPassword, newPassword:$newPassword) {
                  success
              }
          },
      `,
      variables: {oldPassword, newPassword}
    })

    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Old Password is not correct')
  })
  it('return an error if user not exist', async () => {
    const oldPassword = 'oldPassword'
    const newPassword = 'newPassword'
    context.user._id = 'incorrectId'
    const networkInterface = mockNetworkInterfaceWithSchema({schema, context})
    const {errors} = await networkInterface.query({
      query: gql`
          mutation changePassword($oldPassword: String!, $newPassword: String!)  {
              changePassword(oldPassword:$oldPassword, newPassword:$newPassword) {
                  success
              }
          },
      `,
      variables: {oldPassword, newPassword}
    })

    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('User not found')
  })
})
