// @flow
import fetch from 'node-fetch'
import { logInWithFacebook, loginWithGuest } from '../../services/loginService'
import { renewTokenOnLogin } from '../../../configuration/common'
import { UsersRepository, usersRepository } from '../../repositories/UsersRepository'

const repositoriesContext = {
  Users: usersRepository
}

export const accountResolvers = {
  Query: {
    CurrentUser (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      return context.user
    }
  },
  Mutation: {
    async logInWithFacebookAccessToken (root: ?string, args: { accessTokenFb: string }, passedContext: Object) {
      const { accessTokenFb } = args
      const userIdRequest = `https://graph.facebook.com/me?access_token=${accessTokenFb}`
      const userIdResponse = await fetch(userIdRequest)
      const userIdParsedResponse = await userIdResponse.json()
      const userIdFb = userIdParsedResponse.id || null

      return logInWithFacebook(root, {...args, userIdFb}, passedContext)
    },
    async logInWithFacebook (root: ?string, args: { accessTokenFb: string, userIdFb: string }, passedContext: Object) {
      return logInWithFacebook(root, args, passedContext)
    },
    async logIn (root: ?string, args: { username: string, password: string, deviceId: string, saveToken: boolean }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      try {
        const user = await context.Users.findByUsername(args.username)

        if (!user) {
          throw new Error('User not found')
        }

        const isMatch = await UsersRepository.comparePassword(user.password, args.password)
        if (isMatch) {
          if (args.saveToken) {
            user.currentAccessToken = await context.Users.insertNewUserToken(user._id, args.deviceId)
          }
          context.req.logIn(user, (err) => { if (err) throw err })
          // TODO: remove password field from user object before returning it
          return user
        }
        throw new Error('Wrong username or password')
      } catch (e) {
        throw e
      }
    },
    async logInWithToken (root: ?string, args: { userId: string, accessToken: string, deviceId: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      try {
        const user = await context.Users.getById(args.userId)

        if (!user) {
          throw new Error('User not found')
        }

        const isMatch = await context.Users.findActiveToken(args.userId, args.accessToken, args.deviceId)
        if (isMatch) {
          if (renewTokenOnLogin) {
            await context.Users.removeToken(args.userId, args.accessToken)
            user.currentAccessToken = await context.Users.insertNewUserToken(user._id, args.deviceId)
          } else {
            user.currentAccessToken = args.accessToken
          }
          context.req.logIn(user, (err) => { if (err) throw err })
          return user
        }
        throw new Error('Token expired')
      } catch (e) {
        throw e
      }
    },
    async logOut (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      if (context.user) {
        const userId = context.user._id
        const accessToken = context.user.currentAccessToken
        await context.Users.removeToken(userId, accessToken)
        context.req.logOut()
      }
      return {_id: 'loggedOut', username: '', activated: false, facebookId: null, accessToken: null}
    },
    async clearToken (root: ?string, args: { userId: string, token: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      await context.Users.removeToken(args.userId, args.token)
      return true
    },
    async setUsernameAndPasswordForGuest (root: ?string, args: { username: string, password: string, deviceId: string, saveToken: boolean }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      try {
        const username = args.username.trim()
        if (!username || !args.password) {
          throw new Error('Username and password cannot be empty')
        }

        const dbUser = await context.Users.findByUsername(username)

        if (dbUser) {
          throw new Error('Username is already taken')
        }

        let user = context.user

        if (!user) {
          // not passing device id skips unnecessary creation of access token (created at logIn below)
          user = await loginWithGuest(root, {courseId: args.courseId}, context)
        }
        await context.Users.updateUser(user._id, username, args.password)

        return accountResolvers.Mutation.logIn(root, {
          username,
          password: args.password,
          deviceId: args.deviceId,
          saveToken: args.saveToken
        }, context)
      } catch (e) {
        throw e
      }
    },
    async resetPassword (root: ?string, args: { username: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      const updatedUser = await context.Users.resetUserPassword(args.username)
      if (updatedUser) {
        // TODO check after domain successfully verified, send email with reset link
        // sendMail({
        //     from: 'thebrain.pro',
        //     to: 'jmozgawa@thebrain.pro',
        //     subject: 'logInWithFacebook',
        //     text: 'THIS IS TEST MESSAGE'
        // });
        return {success: true}
      } else {
        return {success: false}
      }
    },
    async changePassword (root: ?string, args: { oldPassword: string, newPassword: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      try {
        const userId = context.user._id
        const user = await context.Users.getById(userId)

        if (!user) {
          throw new Error('User not found')
        }

        const isOldPasswordValid = await UsersRepository.comparePassword(user.password, args.oldPassword)
        if (!isOldPasswordValid) {
          throw new Error('Old Password is not correct')
        }

        const updatedUser = await context.Users.changePassword(context.user._id, args.newPassword)
        if (updatedUser) {
          return {success: true}
        } else {
          return {success: false}
        }
      } catch (e) {
        throw e
      }
    }
  }
}
