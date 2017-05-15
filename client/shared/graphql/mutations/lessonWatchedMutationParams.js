import update from 'immutability-helper'

import currentUserQuery from '../queries/currentUser'

export default {
  props: ({ ownProps, mutate }) => ({
    lessonWatchedMutation: () => mutate({
      updateQueries: {
        Lesson: (prev, { mutationResult }) => {
          const updateResults = update(prev, {
            Lesson: {
              $set: mutationResult.data.createItemsAndMarkLessonAsWatched
            }
          })
          return updateResults
        }
      },
      refetchQueries: [{
        query: currentUserQuery
      }]
    })
  })
}
