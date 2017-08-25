// @flow

import fetch from 'node-fetch'
import returnItemAfterEvaluation from './tools/returnItemAfterEvaluation'
import facebookIds from '../configuration/facebook'
import { UsersRepository } from './repositories/UsersRepository'
// import { sendMail } from './tools/emailService'

const resolvers = {
  Query: {
    async Achievements (root: ?string, args: ?Object, context: Object) {
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
    Courses (root: ?string, args: ?Object, context: Object) {
      return context.Courses.getCourses()
    },
    async Reviews (root: ?string, args: ?Object, context: Object) {
      const userDetails = await context.UserDetails.getById(context.user._id)
      return context.Items.getReviews(context.user._id, userDetails.isCasual)
    },
    Course (root: ?string, args: { _id: string }, context: Object) {
      return context.Courses.getCourse(args._id)
    },
    Flashcards (root: ?string, args: ?Object, context: Object) {
      return context.Flashcards.getFlashcards()
    },
    Flashcard (root: ?string, args: { _id: string }, context: Object) {
      return context.Flashcards.getFlashcard(args._id)
    },
    async Lesson (root: ?string, args: { courseId: string }, context: Object) {
      if (context.user) {
        const lessonPosition = await context.UserDetails.getNextLessonPosition(args.courseId, context.user._id)
        return context.Lessons.getCourseLessonByPosition(args.courseId, lessonPosition)
      }
      return null
    },
    Lessons (root: ?string, args: { courseId: string }, context: Object) {
      return context.Lessons.getLessons(args.courseId)
    },
    LessonCount (root: ?string, args: ?Object, context: Object) {
      return context.Lessons.getLessonCount()
    },
    Item (root: ?string, args: { _id: string }, context: Object) {
      return context.Items.getItemById(args._id, context.user._id)
    },
    async ItemsWithFlashcard (root: ?string, args: ?Object, context: Object) {
      if (context.user) {
        const userDetails = await context.UserDetails.getById(context.user._id)
        return context.ItemsWithFlashcard.getItemsWithFlashcard(context.user._id, userDetails.isCasual)
      }
      return []
    },
    async SessionCount (root: ?string, args: ?Object, context: Object) {
      if (context.user) {
        const userDetails = await context.UserDetails.getById(context.user._id)
        return context.ItemsWithFlashcard.getSessionCount(context.user._id, userDetails.isCasual)
      } else {
        return {}
      }
    },
    CurrentUser (root: ?string, args: ?Object, context: Object) {
      return context.user
    },
    async UserDetails (root: ?string, args: ?Object, context: Object) {
      let userId = context.user && context.user._id
      if (!userId) {
        return {}
      }
      return context.UserDetails.getById(context.user._id)
    }
  },
  Mutation: {
    async selectCourse (root: ?string, args: { courseId: string }, context: Object) {
      let userId = context.user && context.user._id
      if (!userId) {
        const guestUser = await loginWithGuest(root, args, context)
        userId = guestUser._id
      }
      return context.UserDetails.selectCourse(userId, args.courseId)
    },
    async closeCourse (root: ?string, args: ?Object, context: Object) {
      let userId = context.user && context.user._id
      if (!userId) {
        console.log('Gozdecki: guestUser')
      }
      return context.UserDetails.closeCourse(userId)
    },
    async createItemsAndMarkLessonAsWatched (root: ?string, args: { courseId: string }, context: Object) {
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
      // TODO THIS SPLICE HAS TO GO
      flashcardIds.splice(3)
      const flashcards = await context.Flashcards.getFlashcardsByIds(flashcardIds)
      flashcards.forEach((flashcard) => {
        if(!userDetails.isCasual || (userDetails.isCasual && flashcard.isCasual)) {
          context.Items.create(flashcard._id, userId, !!flashcard.isCasual)
        }
      })
      await context.UserDetails.updateNextLessonPosition(args.courseId, userId)
      const nextLessonPosition = await context.UserDetails.getNextLessonPosition(args.courseId, userId)
      return context.Lessons.getCourseLessonByPosition(args.courseId, nextLessonPosition)
    },
    async clearNotCasualItems(root: ?string, args: ?Object, context: Object) {
      const userDetails = await context.UserDetails.getById(context.user._id)
      if(userDetails.isCasual) {
        context.Items.clearNotCasualItems(context.user._id)
      }
      return true
    },
    async logInWithFacebook (root: ?string, args: { accessToken: string, userId: string }, context: Object) {
      const {accessToken, userId} = args
      const requestUrl = `https://graph.facebook.com/v2.10/${userId}?fields=name,email&access_token=${accessToken}`;
      const res = await fetch(requestUrl)
      const parsedResponse = await res.json()
      if(parsedResponse.error) {
        console.error('FBLogin failed:', parsedResponse)
        return null
      }
      if (parsedResponse.id === userId) {
        let user = await context.Users.findByFacebookId(userId)
        let idToUpdate = null
        if(user) {
          idToUpdate = user._id
        } else  {
          if(context.user && context.user._id) {
            idToUpdate = context.user._id
          } else {
            user = await context.Users.createGuest()
            idToUpdate = user._id
          }
        }
        user = await context.Users.updateFacebookUser(idToUpdate, userId, parsedResponse.name, parsedResponse.email)
        context.req.logIn(user, (err) => { if (err) throw err })
        return user
      } else {
        return null
      }
    },
    async logIn (root: ?string, args: { username: string, password: string }, context: Object) {
      try {
        const user = await context.Users.findByUsername(args.username)

        if (!user) {
          throw new Error('User not found')
        }

        const isMatch = await UsersRepository.comparePassword(user.password, args.password)
        if (isMatch) {
          context.req.logIn(user, (err) => { if (err) throw err })
          return user
        }
        throw new Error('Wrong username or password')
      } catch (e) {
        throw e
      }
    },
    async logOut (root: ?string, args: ?Object, context: Object) {
      if (context.user) {
        context.req.logOut()
      }
      return {_id: 'loggedOut', username: 'loggedOut', activated: false, facebookId: null}
    },
    async hideTutorial (root: ?string, args: ?Object, context: Object) {
      return context.UserDetails.disableTutorial(context.user._id)
    },
    async switchUserIsCasual (root: ?string, args: ?Object, context: Object) {
      return context.UserDetails.switchUserIsCasual(context.user._id)
    },
    async setUserIsCasual (root: ?string, args: { isCasual: boolean }, context: Object) {
      return context.UserDetails.setUserIsCasual(context.user._id, args.isCasual)
    },
    async setUsernameAndPasswordForGuest (root: ?string, args: { username: string, password: string }, context: Object) {
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
          user = await loginWithGuest(root, args, context)
        }
        await context.Users.updateUser(user._id, username, args.password)

        return resolvers.Mutation.logIn(root, {username, password: args.password}, context)
      } catch (e) {
        throw e
      }
    },
    async processEvaluation (root: ?string, args: { itemId: string, evaluation: number }, context: Object) {
      await context.UserDetails.updateUserXp(context.user._id, 'processEvaluation')

      const item = await context.Items.getItemById(args.itemId, context.user._id)
      const newItem = returnItemAfterEvaluation(args.evaluation, item)
      // TODO move this to repository
      await context.Items.update(args.itemId, newItem, context.user._id)
      const userDetails = await context.UserDetails.getById(context.user._id)
      return context.ItemsWithFlashcard.getItemsWithFlashcard(context.user._id, userDetails.isCasual)
    },
    async confirmLevelUp (root: ?string, args: ?Object, context: Object) {
      return context.UserDetails.resetLevelUpFlag(context.user._id)
    },
    async resetPassword (root: ?string, args: { username: string }, context: Object) {
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
    async changePassword (root: ?string, args: { oldPassword: string, newPassword: string }, context: Object) {
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

const loginWithGuest = async (root: ?string, args: ?Object, context: Object) => {
  const guestUser = await context.Users.createGuest(args.courseId)
  context.req.logIn(guestUser, (err) => { if (err) throw err })
  return guestUser
}

//
process.on('unhandledRejection', (reason) => {
  // console.log('Reason: ' + reason)
  throw (reason)
})

export default resolvers
