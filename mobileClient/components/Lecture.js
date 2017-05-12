// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Text } from 'react-native'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-native'

import lessonWatchedMutationParams from '../../client/shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutationSchema from '../../client/shared/graphql/queries/lessonWatchedMutationSchema'

class Lecture extends React.Component {
  render () {

    if (this.props.data.loading) {
      return (<Text>Loading...</Text>)
    }

    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    return <LectureVideoWithRouter lesson={this.props.data.Lesson}/>
  }
}

class LectureVideo extends React.Component {
  state: Object

  constructor (props: Object) {
    super(props)
    this.state = {
      isReady: false,
    }
  }

  render () {
    return (
      <YouTube
        ref="youtubePlayer"
        videoId={this.props.lesson.youtubeId} // The YouTube video ID
        play={true}           // control playback of video with true/false
        hidden={false}        // control visiblity of the entire view
        playsInline={false}    // control whether the video should play inline
        loop={false}          // control whether the video should loop when ended
        showinfo={false}
        modestbranding={false}
        rel={false}


        onChangeState={this._onChangeState}

        style={{alignSelf: 'stretch', height: 300, backgroundColor: 'red', marginVertical: 10}}
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

const query = gql`
    query Lesson {
        Lesson {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`

export default graphql(query)(Lecture)

