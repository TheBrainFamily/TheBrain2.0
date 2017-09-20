// @flow
import 'sweetalert2/dist/sweetalert2.min.css'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import YouTube from 'react-youtube'

import lessonsQuery from '../../shared/graphql/queries/lessons'
import currentLessonQuery from '../../shared/graphql/queries/currentLesson'

class Lectures extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return !!nextProps.selectedCourse
  }

  render () {
    const opts = {
      height: '240',
      width: '320',
      opacity: 0.2,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }

    const videosElements = this.props.currentLesson.Lesson && this.props.lessons.Lessons && this.props.lessons.Lessons.map(lesson =>
        <div style={{
          display: 'inline-block', margin: '1%',
          opacity: lesson.position > this.props.currentLesson.Lesson.position ? 0.5 : 1
        }}>
          <YouTube
            className={'youTube-player'}
            videoId={lesson.youtubeId}
            opts={opts}
          />
        </div>
      )
    return (
      <div>
        <h1>LECTURES LIST - {this.props.selectedCourse && this.props.selectedCourse.name.toUpperCase()}</h1>
        {videosElements}
      </div>

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
    options: (ownProps) => {
      if (!ownProps.selectedCourse) {
        return ({
          variables: {
            courseId: ''
          }
        })
      }
      const courseId = ownProps.selectedCourse._id
      return ({
        variables: { courseId }
      })
    }
  }),
  graphql(lessonsQuery, {
    name: 'lessons',
    options: (ownProps) => {
      if (!ownProps.selectedCourse) {
        return ({
          variables: {
            courseId: ''
          }
        })
      }
      const courseId = ownProps.selectedCourse._id
      return {
        variables: { courseId }
      }
    }
  })
)(Lectures, ['currentLesson', 'lessons'])

