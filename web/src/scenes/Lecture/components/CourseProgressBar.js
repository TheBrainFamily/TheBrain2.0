// @flow

import React from 'react'
import ProgressBar from '../../../components/ProgressBar'
import { courseProgressBarWrapper } from './courseProgressBarWrapper'

class CourseProgressBar extends React.Component {
  render () {
    if (this.props.currentLesson.loading || this.props.lessonCount.loading || !this.props.selectedCourse) {
      return <div />
    }

    const lessonsTotal = this.props.lessonCount.LessonCount.count
    const lesson = this.props.currentLesson.Lesson
    // set to lessonsTotal e.g. in case you finished the course and the next lesson position is higher than the total lesson number
    const currentLesson = lesson ? lesson.position - 1 : lessonsTotal
    const progress = currentLesson / lessonsTotal

    return (
      <ProgressBar progress={progress} label={'COURSE PROGRESS'} width={1024} category={this.props.selectedCourse.name} />
    )
  }
}

export default courseProgressBarWrapper(CourseProgressBar)
