// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Text, View, Animated, Easing } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-native'

import Loading from './Loading'

import styles from '../styles/styles'

import lessonWatchedMutationParams from '../../client/shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutationSchema from '../../client/shared/graphql/queries/lessonWatchedMutationSchema'
import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Lecture extends React.Component {
  componentWillMount () {
    this.infoScale = new Animated.Value(0)
  }

  componentDidMount() {
    Animated.timing(this.infoScale, {
      toValue: 1,
      duration: 2000,
      easing: Easing.elastic(1)
    }).start()
  }

  render () {
    if (this.props.data.loading) {
      return (
        <View style={styles.videoPlaceholder}>
          <Loading />
        </View>
      )
    }

    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    if (!this.props.data.Lesson) {
      return (<Text style={[styles.textDefault, { margin: 35 }]}>No more lessons</Text>)
    }

    return (
      <View style={{ width: '100%' }}>
        <Animated.View style={{ transform: [{ scale: this.infoScale }]}}>
          <Text
            style={[styles.textDefault, {
              margin: 30,
              width: 200,
              alignSelf: 'center'
            }]}>
            Watch video and wait for the question
          </Text>
        </Animated.View>
        <LectureVideoWithRouter lesson={this.props.data.Lesson} />
      </View>
    )
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
        fullscreen={true}
        loop={false}
        showinfo={false}
        modestbranding={false}
        rel={false}
        onChangeState={this._onChangeState}
        style={{ alignSelf: 'stretch', height: 300, backgroundColor: '#000' }}
      />
    )
  }

  _onChangeState = (event) => {
    console.log('Gozdecki: event', event)
    if (event.state === 'ended') {
      this.props.lessonWatchedMutation().then((abc) => {
        let url = '/questions'
        if (this.props.lesson.position <= 1) {
          url = '/wellDone'
        }
        this.props.history.push(url)
      })
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
