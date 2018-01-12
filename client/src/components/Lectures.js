// @flow
import 'sweetalert2/dist/sweetalert2.min.css'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'

import lessonsQuery from '../graphql/queries/lessons'
import currentLessonQuery from '../graphql/queries/currentLesson'

class VideoPreview extends React.Component {
  state = { previewMode: true }
  opts = {
    height: '240',
    width: '320',
    opacity: 0.2,
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  }

  render () {
    const cursor = this.props.locked ? '' : 'pointer'

    return (
      <div key={this.props.lesson.youtubeId} style={{
        display: 'inline-block',
        margin: '1%',
        opacity: this.props.lesson.position > this.props.currentLesson.Lesson.position ? 0.5 : 1
      }}>
        { this.state.previewMode ? <img
          onClick={() => {
            if (!this.props.locked) {
              this.setState({ previewMode: false })
            }
          }}
          style={{ height: '240px', width: '320px', justifyContent: 'center', cursor: cursor }}
          src={`https://img.youtube.com/vi/${this.props.lesson.youtubeId}/0.jpg`}
        /> : <YouTube
          className={'youTube-player'}
          videoId={this.props.lesson.youtubeId}
          opts={this.opts}
        />}
      </div>)
  }
}

class Lectures extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !!nextProps.selectedCourse
  }

  render () {
    const videosElements = this.props.currentLesson.Lesson && this.props.lessons.Lessons && this.props.lessons.Lessons.map(lesson =>
      <div key={lesson.youtubeId} style={{
        display: 'inline-block',
        margin: '1%',
        opacity: lesson.position > this.props.currentLesson.Lesson.position ? 0.6 : 1,
        width: '320px'
      }}>
        <VideoPreview {...this.props} lesson={lesson}
          locked={lesson.position > this.props.currentLesson.Lesson.position} />
        <div style={{ textAlign: 'center' }}>{lesson.description}</div>
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
