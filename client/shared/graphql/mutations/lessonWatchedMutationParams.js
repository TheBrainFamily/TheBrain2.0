import update from 'immutability-helper'

export default {
  props: ({ ownProps, mutate }) => ({
    lessonWatchedMutation: () => mutate({
      updateQueries: {
        Lesson: (prev, { mutationResult }) => {
          console.log('PINGWIN: mutationResult', mutationResult);
          const updateResults = update(prev, {
            Lesson: {
              $set: mutationResult.data.createItemsAndMarkLessonAsWatched
            }
          })
          return updateResults
        }
      }
    }),
  })
}
