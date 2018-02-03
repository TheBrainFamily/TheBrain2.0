// @flow

import React from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import WithData from '../../../components/WithData'
import ProgressBar from '../../../components/ProgressBar'
import { getGraphqlForCurrentLesson } from 'thebrain-shared/graphql/lessons/currentLesson'
import lessonCountQuery from 'thebrain-shared/graphql/lessons/lessonCount'

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
  getGraphqlForCurrentLesson({
    graphql,
    name: 'currentLesson',
    skipCondition: props => !props.selectedCourse}),
  graphql(lessonCountQuery, {name: 'lessonCount'})
)(WithData(CourseProgressBar, ['currentLesson']))
