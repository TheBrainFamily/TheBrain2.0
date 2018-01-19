// @flow

import React from 'react'
import YouTube from 'react-youtube'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import lessonWatchedMutationParams from 'thebrain-shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutation from '../../../shared/graphql/queries/lessonWatchedMutation'
import clearNotCasualItems from 'thebrain-shared/graphql/mutations/clearNotCasualItems'
import CourseIcon from './CourseIcon'
import courseById from 'thebrain-shared/graphql/queries/courseById'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import CourseProgressBar from './CourseProgressBar'
import LevelUpWrapper from './LevelUpWrapper'

class Lecture extends React.Component {
  _onEnd = async () => {
    const courseId = (this.props.selectedCourse && this.props.selectedCourse._id) || this.props.match.params.courseId
    await this.props.clearNotCasual()
    this.props.lessonWatchedMutation({courseId}).then(() => {
      this.props.dispatch(push('/questions'))
    })
  }

  render () {
    if (this.props.data.loading || this.props.courseData) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

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

    return (
      <span>
        <CourseProgressBar />
        <FlexibleContentWrapper>
          <div id='video'>
            <h2>Watch the video<br />
              and wait for the questions.</h2>
            <LectureVideoWithRouter lesson={this.props.data.Lesson} onEnd={this._onEnd} />
            <br />
            <div className='skipLecture' onClick={this._onEnd}>Skip intro and start learning</div>
            <CourseIcon simple size={100} name={this.props.courseData.Course.name} />
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
        onEnd={this.props.onEnd}
      />
    )
  }
}

const LectureVideoWithRouter = compose(
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
  graphql(lessonWatchedMutation, lessonWatchedMutationParams),
  // TODO can't we simplify this?
  graphql(clearNotCasualItems, {
    props: ({ownProps, mutate}) => ({
      clearNotCasual: () => mutate({
      })
    })
  }),
  graphql(currentLessonQuery, {
    options: (ownProps) => {
      const selectedCourse = (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
      return ({
        variables: {courseId: selectedCourse},
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(courseById, {
    options: (ownProps) => {
      const selectedCourse = (ownProps.selectedCourse && ownProps.selectedCourse._id) || ownProps.match.params.courseId
      return ({
        variables: {_id: selectedCourse},
        fetchPolicy: 'network-only'
      })
    },
    name: 'courseData'
  }),
  LevelUpWrapper
)(Lecture)
