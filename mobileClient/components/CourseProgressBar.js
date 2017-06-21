// @flow

import React from 'react'
import { View } from 'react-native'
import { graphql, compose } from 'react-apollo'

import ProgressBar from './ProgressBar'

import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'
import lessonCountQuery from '../../client/shared/graphql/queries/lessonCount'

class CourseProgressBar extends React.Component {
  render () {
    if (this.props.currentLesson.loading || this.props.lessonCount.loading) {
      return <View />
    }

    const lessonsTotal = this.props.lessonCount.LessonCount.count
    const lesson = this.props.currentLesson.Lesson
    const currentLesson = lesson ? lesson.position - 1 : lessonsTotal
    const progress = currentLesson / lessonsTotal

    return (
      <ProgressBar progress={progress} />
    )
  }
}

export default compose(
  graphql(currentLessonQuery, {
    name: 'currentLesson',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(lessonCountQuery, { name: 'lessonCount' })
)(CourseProgressBar)
