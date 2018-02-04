import { withRepositories } from '../withRepositories'

export const lessonsResolvers = {
  Query: {
    Lesson: withRepositories(async (root, args: {courseId: string}, context) => {
      if (context.user) {
        const lessonPosition = await context.UserDetails.getNextLessonPosition(args.courseId, context.user._id)
        return context.Lessons.getCourseLessonByPosition(args.courseId, lessonPosition)
      }
      return null
    }),
    Lessons: withRepositories(async (root, args, context) => {
      return context.Lessons.getLessons(args.courseId)
    }),
    LessonCount: withRepositories((root, args, context) => {
      return context.Lessons.getLessonCount()
    })
  }
}
