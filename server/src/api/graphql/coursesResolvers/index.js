// @flow
import { loginWithGuest } from '../../services/loginService'
import { coursesRepository } from '../../repositories/CoursesRepository'
import { userDetailsRepository } from '../../repositories/UserDetailsRepository'

const repositoriesContext = {
  Courses: coursesRepository,
  UserDetails: userDetailsRepository
}

export const coursesResolvers = {
  Query: {
    Courses (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      return context.Courses.getCourses()
    },
    Course (root: ?string, args: { _id: string }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.Courses.getCourse(args._id)
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
      return context.UserDetails.closeCourse(userId)
    }
  }
}
