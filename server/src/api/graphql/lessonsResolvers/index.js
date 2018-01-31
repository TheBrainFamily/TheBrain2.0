import { userDetailsRepository } from '../../repositories/UserDetailsRepository'
import { lessonsRepository } from '../../repositories/LessonsRepository'

const repositoriesContext = {
  UserDetails: userDetailsRepository,
  Lessons: lessonsRepository
}

export const lessonsResolvers = {
  Query: {
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
    }
  }
}
