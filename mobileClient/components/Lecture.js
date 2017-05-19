// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Text } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-native'

import lessonWatchedMutationParams from '../../client/shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutationSchema from '../../client/shared/graphql/queries/lessonWatchedMutationSchema'
import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Lecture extends React.Component {
  render () {

    if (this.props.data.loading) {
      return (<Text>Loading...</Text>)
    }

    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    return <LectureVideoWithRouter lesson={this.props.data.Lesson} />
  }
}

class LectureVideo extends React.Component {
  render () {
    return (
      <YouTube
        ref="youtubePlayer"
        videoId={this.props.lesson.youtubeId}
        play={false}
        hidden={false}
        playsInline={false}
        loop={false}
        showinfo={false}
        modestbranding={false}
        rel={false}
        onChangeState={this._onChangeState}
        style={{ alignSelf: 'stretch', height: 300, backgroundColor: 'red' }}
      />

    )
  }

  _onChangeState = (event) => {
    console.log('Gozdecki: event', event)
    if (event.state === 'ended') {
      this.props.lessonWatchedMutation()
      this.props.history.push('/wellDone')
    }
  }
}

const LectureVideoWithRouter = compose(
  graphql(lessonWatchedMutationSchema, lessonWatchedMutationParams),
  withRouter
)(LectureVideo)

export default graphql(currentLessonQuery, {
  options: {
    fetchPolicy: 'network-only'
  }
})(Lecture)

