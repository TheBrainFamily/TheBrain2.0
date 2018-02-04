// @flow
import { loginWithGuest } from '../../services/loginService'
import { withRepositories } from '../withRepositories'

export const coursesResolvers = {
  Query: {
    Courses: withRepositories((root, args, context: Object) => context.Courses.getCourses()),
    Course: withRepositories((root: ?string, args: { _id: string }, context: Object) =>
      context.Courses.getCourse(args._id))
  },
  Mutation: {
    selectCourse: withRepositories(async (root: ?string, args: { courseId: string }, context: Object) => {
      let userId = context.user && context.user._id
      if (!userId) {
        const guestUser = await loginWithGuest(root, args, context)
        userId = guestUser._id
      }
      return context.UserDetails.selectCourse(userId, args.courseId)
    }),
    selectCourseSaveToken: withRepositories((root, args: { courseId: string, deviceId: string }, context: Object) =>
       coursesResolvers.Mutation.selectCourse(root, args, context)),
    closeCourse: withRepositories((root: ?string, args: ?Object, context: Object) => {
      let userId = context.user && context.user._id
      return context.UserDetails.closeCourse(userId)
    })
  }
}
