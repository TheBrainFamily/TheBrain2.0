// @flow

import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ProgressBar from './ProgressBar'

import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import lessonCountQuery from 'thebrain-shared/graphql/queries/lessonCount'

export class CourseProgressBar extends React.Component {
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

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  withRouter,
  graphql(currentLessonQuery, {
    name: 'currentLesson',
    options: (ownProps) => {
      const selectedCourse = (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
      return ({
        variables: {courseId: selectedCourse},
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(lessonCountQuery, {name: 'lessonCount'})
)(CourseProgressBar)
