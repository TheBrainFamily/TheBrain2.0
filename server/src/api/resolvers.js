// @flow

import fetch from 'node-fetch'
import returnItemAfterEvaluation from './tools/returnItemAfterEvaluation'
import facebookIds from '../configuration/facebook'
// import { sendMail } from './tools/emailService'

const resolvers = {
  Query: {
    Flashcards (root: ?string, args: ?Object, context: Object) {
      return context.Flashcards.getFlashcards()
    },
    Flashcard (root: ?string, args: { _id: string }, context: Object) {
      return context.Flashcards.getFlashcard(args._id)
    },
    async Lesson (root: ?string, args: ?Object, context: Object) {
      let nextLessonPosition
      if (context.user) {
        nextLessonPosition = await context.UserDetails.getNextLessonPosition(context.user._id)
      } else {
        nextLessonPosition = 1
      }
      return context.Lessons.getLessonByPosition(nextLessonPosition)
    },
    Lessons (root: ?string, args: ?Object, context: Object) {
      return context.Lessons.getLessons()
    },
    Item (root: ?string, args: { _id: string }, context: Object) {
      return context.Items.getItemById(args._id, context.user._id)
    },
    ItemsWithFlashcard (root: ?string, args: ?Object, context: Object) {
      if (context.user) {
        return context.ItemsWithFlashcard.getItemsWithFlashcard(context.user._id)
      } else {
        return []
      }
    },
    SessionCount (root: ?string, args: ?Object, context: Object) {
      if (context.user) {
        return context.ItemsWithFlashcard.getSessionCount(context.user._id)
      } else {
        return {}
      }
    },
    CurrentUser (root: ?string, args: ?Object, context: Object) {
      return context.user
    }
  },
  Mutation: {
    async createItemsAndMarkLessonAsWatched (root: ?string, args: ?Object, context: Object) {
      let userId = context.user && context.user._id
      if (!userId) {
        const guestUser = await context.Users.createGuest()
        console.log('Gozdecki: guestUser', guestUser)
        userId = guestUser._id
        context.req.logIn(guestUser, (err) => { if (err) throw err })
      }
      const currentLessonPosition = await context.UserDetails.getNextLessonPosition(userId)
      console.log('JMOZGAWA: currentLessonPosition', currentLessonPosition)
      const lesson = await context.Lessons.getLessonByPosition(currentLessonPosition)
      console.log('JMOZGAWA: lesson', lesson)
      const flashcardIds = lesson.flashcardIds
      // TODO THIS SPLICE HAS TO GO
      flashcardIds.splice(1)
      flashcardIds.forEach((flashcardId) => {
        context.Items.create(flashcardId, userId)
      })
      await context.UserDetails.updateNextLessonPosition(userId)
      const nextLessonPosition = await context.UserDetails.getNextLessonPosition(userId)
      return context.Lessons.getLessonByPosition(nextLessonPosition)
    },
    async logInWithFacebook (root: ?string, args: { accessToken: string }, context: Object) {
      const {accessToken: userToken} = args
      const requestUrl = `https://graph.facebook.com/debug_token?input_token=${userToken}&access_token=${facebookIds.appToken}`

      const res = await fetch(requestUrl)
      const parsedResponse = await res.json()
      if (parsedResponse.data.is_valid) {
        const facebookId = parsedResponse.data.user_id
        const user = await context.Users.findByFacebookId(facebookId)

        if (user) {
          context.req.logIn(user, (err) => { if (err) throw err })
          return user
        }
        const newUser = await context.Users.updateFacebookUser(context.user._id, facebookId)
        return newUser
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

        const isMatch = await user.comparePassword(args.password)
        if (isMatch) {
          context.req.logIn(user, (err) => { if (err) throw err })
          return user
        }
      } catch (e) {
        throw e
      }
    },
    async logOut (root: ?string, args: ?Object, context: Object) {
      if (context.user) {
        context.req.logOut()
      }
      return {_id: 'loggedOut', username: 'loggedOut', activated: false}
    },
    async setUsernameAndPasswordForGuest (root: ?string, args: { username: string, password: string }, context: Object) {
      return context.Users.updateUser(context.user._id, args.username, args.password)
    },
    async processEvaluation (root: ?string, args: { itemId: string, evaluation: number }, context: Object) {
      const item = await context.Items.getItemById(args.itemId, context.user._id)
      const newItem = returnItemAfterEvaluation(args.evaluation, item)
      // TODO move this to repository
      await context.Items.update(args.itemId, newItem, context.user._id)

      return context.ItemsWithFlashcard.getItemsWithFlashcard(context.user._id)
    },
      async resetPassword (root: ?string, args: { username: string, password: string }, context: Object) {
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
    }
  }
}
//
process.on('unhandledRejection', (reason) => {
  // console.log('Reason: ' + reason)
  throw (reason);
})

export default resolvers
