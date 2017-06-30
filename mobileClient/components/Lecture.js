// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Animated, Easing, Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'

import Loading from './Loading'
import CircleButton from './CircleButton'

import styles from '../styles/styles'
import courseLogos from '../helpers/courseLogos'

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
      duration: 500,
      easing: Easing.elastic(1)
    }).start(() => this.setState({ showLecture: true }))
  }

  render () {
    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    if (!this.props.data.Lesson) {
      return (
        <View>
          <Text style={[styles.textDefault, { marginTop: 35 }]}>Congratulations!</Text>
          <Text style={[styles.menuButtonText, { paddingHorizontal: 50 }]}>You have watched all available lectures in this course.</Text>
        </View>
      )
    }

    const courseLogo = courseLogos[this.props.selectedCourse.name]
    const logoSize = courseLogo.scale * 60

    const selectedCourse = this.props.selectedCourse

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
          <Animatable.View animation='bounceIn'>
            {this.props.data.loading
              ? <View style={styles.videoPlaceholder}>
                <Loading />
              </View>
              : <LectureVideoWithRouter lesson={this.props.data.Lesson} courseId={selectedCourse._id} />
            }
          </Animatable.View>
        }

        <View style={{ marginTop: 20, alignSelf: 'center' }}>
          <CircleButton radius={45} withStaticCircles>
            <SvgUri
              width={logoSize}
              height={logoSize}
              source={courseLogo.file}
              style={{ width: logoSize, height: logoSize, alignSelf: 'center' }}
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
        ref='youtubePlayer'
        videoId={this.props.lesson.youtubeId}
        play={false}
        hidden={false}
        fullscreen
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
      this.props.lessonWatchedMutation(this.props.courseId).then(() => {
        let url = '/questions'
        if (this.props.lesson && this.props.lesson.position <= 2) {
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

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(currentLessonQuery, {
    options: (ownProps) => {
      const selectedCourse = ownProps.selectedCourse._id
      return ({
        variables: { courseId: selectedCourse },
        fetchPolicy: 'network-only'
      })
    }
  })
)(Lecture)
