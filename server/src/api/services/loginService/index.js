// @flow
import { userDetailsRepository } from '../../repositories/UserDetailsRepository'
import { facebookAppId } from '../../../configuration/common'
import fetch from 'node-fetch'
import { usersRepository } from '../../repositories/UsersRepository'

const repositoriesContext = {
  Users: usersRepository,
  UserDetails: userDetailsRepository
}

export const loginWithGuest = async (root: ?string, args: ?Object, passedContext: Object) => {
  const context = {...repositoriesContext, ...passedContext}
  const guestUser = await context.Users.createGuest(args.courseId, args.deviceId)
  await context.UserDetails.create(guestUser._id)
  context.req.logIn(guestUser, (err) => { if (err) throw err })
  return guestUser
}

export const logInWithFacebook = async (root: ?string, args: { accessTokenFb: string, userIdFb: string }, passedContext: Object) => {
  const context = {...repositoriesContext, ...passedContext}
  const {accessTokenFb, userIdFb} = args

  const validFbAppId = facebookAppId
  const appIdRequest = `https://graph.facebook.com/app/?access_token=${accessTokenFb}`
  const appIdResponse = await fetch(appIdRequest)
  const appIdParsedResponse = await appIdResponse.json()
  const tokenAppId = appIdParsedResponse.id || null

  if (!validFbAppId || !tokenAppId || tokenAppId !== validFbAppId) {
    throw new Error(`Facebook access token app id mismatch, tokenAppId: ${tokenAppId} facebookConfig.appId: ${validFbAppId}`)
  }

  const requestUrl = `https://graph.facebook.com/v2.10/${userIdFb}?fields=name,email&access_token=${accessTokenFb}`
  const res = await fetch(requestUrl)
  const parsedResponse = await res.json()
  if (parsedResponse.error) {
    console.error('FBLogin failed:', parsedResponse)
    throw new Error('Facebook token expired')
  }
  if (parsedResponse.id === userIdFb) {
    let user = await context.Users.findByFacebookId(userIdFb)
    let idToUpdate = null
    if (user) {
      idToUpdate = user._id
    } else {
      if (context.user && context.user._id) {
        idToUpdate = context.user._id
      } else {
        user = await context.Users.createGuest()
        await context.UserDetails.create(user._id)
        idToUpdate = user._id
      }
    }
    user = await context.Users.updateFacebookUser(idToUpdate, userIdFb, parsedResponse.name, parsedResponse.email)
    context.req.logIn(user, (err) => { if (err) throw err })
    return user
  } else {
    throw new Error('Invalid facebook response')
  }
}
