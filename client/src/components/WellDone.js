// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { Link } from 'react-router-dom'



export class WellDone extends React.Component {
  componentDidMount () {
    this.props.lessonWatchedMutation()
  }


  render () {
    return <div className="welldone">
      First video done! Click: <Link to={`/questions`}>here</Link> to answer some questions about the video
    </div>
  }
}

const lessonWatchedMutationSchema = gql`
    mutation createItemsAndMarkLessonAsWatched{
        createItemsAndMarkLessonAsWatched{
            _id, position, description, flashcardIds, youtubeId
        }
    }
`

const lessonWatchedMutationParams = {
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
      }
    }),
  })
}



export default compose(
  graphql(lessonWatchedMutationSchema, lessonWatchedMutationParams),
)(WellDone)
