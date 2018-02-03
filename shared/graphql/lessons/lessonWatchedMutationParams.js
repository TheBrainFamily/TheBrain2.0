import update from 'immutability-helper'

export default {
  props: ({ ownProps, mutate }) => ({
    lessonWatchedMutation: ({ courseId }) => mutate({
      variables: {
        courseId
      },
      updateQueries: {
        Lesson: (prev, { mutationResult }) => {
          const updateResults = update(prev, {
            Lesson: {
              $set: mutationResult.data.createItemsAndMarkLessonAsWatched
            }
          })
          return updateResults
        }
      }
    })
  })
}
