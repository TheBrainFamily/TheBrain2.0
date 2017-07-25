// @flow

import React from 'react'
import YouTube from 'react-youtube'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import currentLessonQuery from '../../shared/graphql/queries/currentLesson'
import lessonWatchedMutationParams from '../../shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutationSchema from '../../shared/graphql/queries/lessonWatchedMutationSchema'
import CourseIcon from './CourseIcon'
import courseById from '../../shared/graphql/queries/courseById'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import CourseProgressBar from './CourseProgressBar'

class Lecture extends React.Component {
  render () {
    if (!this.props.data.Lesson) {
      return (
        <div>
          <h2>Congratulations!</h2>
          <p>
            You have watched all available lectures in this course.
          </p>
        </div>
      )
    }

    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    const selectedCourse = this.props.selectedCourse._id || this.props.match.params.courseId

    return (
      <span>
        <CourseProgressBar/>
        <FlexibleContentWrapper>
          <div id='video'>
            <h2>Watch the video<br/>
              and wait for the questions.</h2>
            <LectureVideoWithRouter lesson={this.props.data.Lesson} courseId={selectedCourse}/>
            <br/>
            <CourseIcon simple={true} size={100} name={this.props.courseData.Course.name}/>
          </div>
        </FlexibleContentWrapper>
      </span>
    )
  }
}

export class LectureVideo extends React.Component {
  render () {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }

    return (
      <YouTube
        className={'youTube-player'}
        videoId={this.props.lesson.youtubeId}
        opts={opts}
        onEnd={this._onEnd}
      />
    )
  }

  _onEnd = () => {
    console.log('onYTend props:', this.props)
    this.props.lessonWatchedMutation({courseId: this.props.courseId}).then(() => {
      let url = '/questions'
      if (this.props.lesson && this.props.lesson.position <= 2) {
        url = '/wellDone'
      }
      this.props.dispatch(push(url))
    })

  }
}

const LectureVideoWithRouter = compose(
  graphql(lessonWatchedMutationSchema, lessonWatchedMutationParams),
  withRouter,
  connect()
)(LectureVideo)

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(currentLessonQuery, {
    options: (ownProps) => {
      const selectedCourse = ownProps.selectedCourse._id || ownProps.match.params.courseId
      return ({
        variables: {courseId: selectedCourse},
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(courseById, {
    options: (ownProps) => {
      const selectedCourse = ownProps.selectedCourse._id || ownProps.match.params.courseId
      return ({
        variables: {_id: selectedCourse},
        fetchPolicy: 'network-only'
      })
    },
    name: 'courseData'
  }),
)(Lecture)
