// @flow
import 'sweetalert2/dist/sweetalert2.min.css'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'

import lessonsQuery from '../../shared/graphql/queries/lessons'
import currentLessonQuery from '../../shared/graphql/queries/currentLesson'

class Lectures extends React.Component {

  render () {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }
    const videosElements = this.props.lessons.Lessons && this.props.lessons.Lessons.map(lesson =>
        <div>
          <YouTube
            className={'youTube-player'}
            videoId={lesson.youtubeId}
            opts={opts}
          />
          <hr/>
        </div>
      )
    return (
      <div>
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

const style = {
  title: {
    height: '25%',
    color: '#999',
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    textAlign: 'center'
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#fffc',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
}
