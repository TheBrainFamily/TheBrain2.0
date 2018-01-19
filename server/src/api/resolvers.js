// @flow

import fetch from 'node-fetch'
import returnItemAfterEvaluation from './tools/returnItemAfterEvaluation'
// TODO we are not using the facebookIds, how come?
// import facebookIds from '../configuration/facebook'
// TODO Most probably the UsersRepository shouldnt be used directly here. Repository should be from the context.
import { usersRepository, UsersRepository } from './repositories/UsersRepository'
// import { sendMail } from './tools/emailService'
import { renewTokenOnLogin } from '../configuration/common'
import { itemsRepository } from './repositories/ItemsRepository'
import { lessonsRepository } from './repositories/LessonsRepository'
import { userDetailsRepository } from './repositories/UserDetailsRepository'
import { achievementsRepository } from './repositories/AchievementsRepository'
import { coursesRepository } from './repositories/CoursesRepository'
import { flashcardRepository } from './repositories/FlashcardsRepository'

const repositoriesContext = {
  Flashcards: flashcardRepository,
  Courses: coursesRepository,
  Lessons: lessonsRepository,
  Items: itemsRepository,
  UserDetails: userDetailsRepository,
  Users: usersRepository,
  Achievements: achievementsRepository
}
// TODO split up the resolvers
// TODO Split up repositories to actions?

const resolvers = {
  Query: {
    async Achievements (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      let userId = context.user && context.user._id
      if (!userId) {
        throw Error(`Invalid userId: ${userId}`)
      }
      const userDetails = await context.UserDetails.getById(userId)

      if (!userDetails) {
        throw Error(`Cannot fetch userDetials for userId: ${userId}`)
      }

      const userAchievements = await context.Achievements.getUserAchievements(userDetails)

      const collectedAchievementIds = userAchievements.filter(achievement => achievement.isCollected).map(achievement => achievement._id)
      await context.UserDetails.updateCollectedAchievements(userId, collectedAchievementIds)

      return userAchievements
    },
    Courses (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      return context.Courses.getCourses()
    },
    async Reviews (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      if (!context.user) {
        return []
      }
      const userDetails = await context.UserDetails.getById(context.user._id)
      return context.Items.getReviews(context.user._id, userDetails.isCasual)
    },
    Course (root: ?string, args: { _id: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.Courses.getCourse(args._id)
    },
    Flashcards (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.Flashcards.getFlashcards()
    },
    Flashcard (root: ?string, args: { _id: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.Flashcards.getFlashcard(args._id)
    },
    async Lesson (root: ?string, args: { courseId: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      if (context.user) {
        const lessonPosition = await context.UserDetails.getNextLessonPosition(args.courseId, context.user._id)
        return context.Lessons.getCourseLessonByPosition(args.courseId, lessonPosition)
      }
      return null
    },
    Lessons (root: ?string, args: { courseId: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.Lessons.getLessons(args.courseId)
    },
    LessonCount (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.Lessons.getLessonCount()
    },
    async Items (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      if (context.user) {
        const userDetails = await context.UserDetails.getById(context.user._id)
        return context.Items.getItems(userDetails)
      }
      return []
    },
    async SessionCount (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      if (context.user) {
        const userDetails = await context.UserDetails.getById(context.user._id)
        return context.Items.getSessionCount(context.user._id, userDetails)
      } else {
        return {}
      }
    },
    CurrentUser (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.user
    },
    async UserDetails (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      let userId = context.user && context.user._id
      if (!userId) {
        return {}
      }
      return context.UserDetails.getById(context.user._id)
    }
  },
  Item: {
    flashcard (parentItem, input, passedContext) {
      const context = {...repositoriesContext, ...passedContext}
      return context.Flashcards.getFlashcard(parentItem.flashcardId)
    }
  },
  Mutation: {
    async selectCourse (root: ?string, args: { courseId: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      let userId = context.user && context.user._id
      if (!userId) {
        const guestUser = await loginWithGuest(root, args, context)
        userId = guestUser._id
      }
      return context.UserDetails.selectCourse(userId, args.courseId)
    },
    async selectCourseSaveToken (root: ?string, args: { courseId: string, deviceId: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      let userId = context.user && context.user._id
      if (!userId) {
        const guestUser = await loginWithGuest(root, args, context)
        userId = guestUser._id
      }
      return context.UserDetails.selectCourse(userId, args.courseId)
    },
    async closeCourse (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      let userId = context.user && context.user._id
      if (!userId) {
        console.log('Gozdecki: guestUser')
      }
      return context.UserDetails.closeCourse(userId)
    },
    // TODO move this to a service?
    async createItemsAndMarkLessonAsWatched (root: ?string, args: { courseId: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      let userId = context.user && context.user._id
      if (!userId) {
        console.log('Gozdecki: guestUser')
      }
      const currentLessonPosition = await context.UserDetails.getNextLessonPosition(args.courseId, userId)
      const lesson = await context.Lessons.getCourseLessonByPosition(args.courseId, currentLessonPosition)
      if (!lesson) {
        return {}
      }
      const userDetails = await context.UserDetails.getById(context.user._id)
      const flashcardIds = lesson.flashcardIds
      const flashcards = await context.Flashcards.getFlashcardsByIds(flashcardIds)

      // TODO this should be extracted ant it's functionality properly unit tested
      const ensureNoHardQuestionAtTheBeginning = (flashcards, casualsInRow = 3) => {
        const getCasualFlashcard = () => {
          for (let i = flashcards.length - 1; i >= 0; --i) {
            if (flashcards[i].isCasual) {
              return {flashcard: flashcards[i], index: i}
            }
          }
          return null
        }
        for (let i = 0; i < flashcards.length && i < casualsInRow; ++i) {
          const firstFlashcard = flashcards[i]
          if (!firstFlashcard.isCasual) {
            const casualLookup = getCasualFlashcard()

            if (casualLookup === null) {
              // there is no, casual flashcards
              break
            }

            const {flashcard: casualFlashcard, index} = casualLookup
            if (index !== i) {
              flashcards[index] = firstFlashcard
              flashcards[i] = casualFlashcard
            }
          }
        }
      }

      ensureNoHardQuestionAtTheBeginning(flashcards)
      for (let index = 0; index < flashcards.length; index++) {
        const flashcard = flashcards[index]
        // TODO test for the isCasual case
        if (!userDetails.isCasual || (userDetails.isCasual && flashcard.isCasual)) {
          await context.Items.create(flashcard._id, userId, args.courseId, !!flashcard.isCasual)
        }
      }
      await context.UserDetails.updateNextLessonPosition(args.courseId, userId)
      const nextLessonPosition = await context.UserDetails.getNextLessonPosition(args.courseId, userId)
      return context.Lessons.getCourseLessonByPosition(args.courseId, nextLessonPosition)
    },
    async clearNotCasualItems (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      const userDetails = await context.UserDetails.getById(context.user._id)
      if (userDetails.isCasual) {
        context.Items.clearNotCasualItems(context.user._id)
      }
      return true
    },

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
    async hideTutorial (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.disableTutorial(context.user._id)
    },
    async switchUserIsCasual (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.switchUserIsCasual(context.user._id)
    },
    async setUserIsCasual (root: ?string, args: { isCasual: boolean }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.setUserIsCasual(context.user._id, args.isCasual)
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

        return resolvers.Mutation.logIn(root, {
          username,
          password: args.password,
          deviceId: args.deviceId,
          saveToken: args.saveToken
        }, context)
      } catch (e) {
        throw e
      }
    },
    async clearToken (root: ?string, args: { userId: string, token: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      await context.Users.removeToken(args.userId, args.token)
      return true
    },
    async processEvaluation (root: ?string, args: { itemId: string, evaluation: number }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      await context.UserDetails.updateUserXp(context.user._id, 'processEvaluation')
      const item = await context.Items.getItemById(args.itemId, context.user._id)

      // TODO should this be inside a service?
      const newItem = returnItemAfterEvaluation(args.evaluation, item)
      await context.Items.update(args.itemId, newItem, context.user._id)
      const userDetails = await context.UserDetails.getById(context.user._id)
      return context.Items.getItems(userDetails)
    },
    async confirmLevelUp (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.resetLevelUpFlag(context.user._id)
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

const logInWithFacebook = async (root: ?string, args: { accessTokenFb: string, userIdFb: string }, passedContext: Object) => {
  const context = { ...repositoriesContext, ...passedContext }
  const { accessTokenFb, userIdFb } = args

  const validFbAppId = process.env.FB_APP_ID || null
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

const loginWithGuest = async (root: ?string, args: ?Object, passedContext: Object) => {
  const context = {...repositoriesContext, ...passedContext}
  const guestUser = await context.Users.createGuest(args.courseId, args.deviceId)
  await context.UserDetails.create(guestUser._id)
  context.req.logIn(guestUser, (err) => { if (err) throw err })
  return guestUser
}

//
process.on('unhandledRejection', (reason, p) => {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
  if (reason.graphQLErrors) {
    reason.graphQLErrors.forEach(err => {
      console.log('Graphql err', err)
    })
  }
})

export default resolvers
