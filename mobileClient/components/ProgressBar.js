// @flow

import React from 'react'
import { View } from 'react-native'
import { graphql, compose } from 'react-apollo'

import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'
import lessonCountQuery from '../../client/shared/graphql/queries/lessonCount'
import styles from '../styles/styles'

class ProgressBar extends React.Component {
  render () {
    if (this.props.currentLesson.loading || this.props.lessonCount.loading) {
      return <View />
    }

    const lessonsTotal = this.props.lessonCount.LessonCount.count
    const lesson = this.props.currentLesson.Lesson
    const currentLesson = lesson ? lesson.position - 1 : lessonsTotal
    const progressInPercent = currentLesson / lessonsTotal * 100
    const progressInPercentText = `${progressInPercent}%`

    return (
      <View style={styles.progressBarTrack}>
        <View style={[ styles.progressBarProgressLine, { width: progressInPercentText }]} />
        <View style={[ styles.progressBarProgressCircle, { left: progressInPercentText }]} />
      </View>
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
)(ProgressBar)
