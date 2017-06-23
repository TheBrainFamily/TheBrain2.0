// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Animated, Easing, Image, Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-native'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'

import Loading from './Loading'
import CircleButton from './CircleButton'

import styles from '../styles/styles'

import lessonWatchedMutationParams from '../../client/shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutationSchema from '../../client/shared/graphql/queries/lessonWatchedMutationSchema'
import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Lecture extends React.Component {
  state = {
    showLecture: false
  }

  componentWillMount () {
    this.infoScale = new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(this.infoScale, {
      toValue: 1,
      duration: 2000,
      easing: Easing.elastic(1)
    }).start(() => this.setState({ showLecture: true }))
  }

  render () {
    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    if (!this.props.data.Lesson) {
      return (<Text style={[styles.textDefault, { margin: 35 }]}>No more lessons</Text>)
    }

    return (
      <View style={{ width: '100%' }}>
        <Animated.View style={{ transform: [{ scale: this.infoScale }] }}>
          <Text
            style={[styles.textDefault, {
              margin: 20,
              width: 220,
              alignSelf: 'center'
            }]}>
            Watch the video and answer some questions
          </Text>
        </Animated.View>

        {this.state.showLecture &&
          <Animatable.View animation="bounceIn">
            {this.props.data.loading ?
              <View style={styles.videoPlaceholder}>
                <Loading />
              </View>
              :
              <LectureVideoWithRouter lesson={this.props.data.Lesson} />
            }
          </Animatable.View>
        }

        <View style={{ marginTop: 20, alignSelf: 'center' }}>
          <CircleButton color='#662d91' radius={45} withStaticCircles>
            <SvgUri
              width="60"
              height="60"
              source={require('../images/chemistry.svg')}
              style={{ width: 60, height: 60, alignSelf: 'center' }}
            />
          </CircleButton>
        </View>
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
      this.props.lessonWatchedMutation().then(() => {
        let url = '/questions'
        if (this.props.lesson.position <= 2) {
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
