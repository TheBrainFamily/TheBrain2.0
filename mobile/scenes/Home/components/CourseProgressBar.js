// @flow

import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import ProgressBar from '../../../components/ProgressBar'

import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import lessonCountQuery from 'thebrain-shared/graphql/queries/lessonCount'
import WithData from '../../../components/WithData'

class CourseProgressBar extends React.Component {
  render () {
    if (this.props.currentLesson.loading || this.props.lessonCount.loading) {
      return <ProgressBar progress={0} />
    }

    const lessonsTotal = this.props.lessonCount.LessonCount.count
    const lesson = this.props.currentLesson.Lesson
    // set to lessonsTotal e.g. in case you finished the course and the next lesson position is higher than the total lesson number
    const currentLesson = lesson ? lesson.position - 1 : lessonsTotal
    const progress = currentLesson / lessonsTotal

    return (
      <ProgressBar progress={progress} />
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
  graphql(currentLessonQuery, {
    name: 'currentLesson',
    skip: props => !props.selectedCourse,
    options: (ownProps) => {
      const selectedCourse = ownProps.selectedCourse._id
      return ({
        variables: { courseId: selectedCourse },
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(lessonCountQuery, { name: 'lessonCount' })
)(WithData(CourseProgressBar, ['currentLesson']))
