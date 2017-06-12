// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Text, View } from 'react-native'
// import Introduction from './Introduction';
// import Content from './Content';
import Loading from './Loading'
import {graphql} from 'react-apollo'
import { withRouter } from 'react-router-native'

import styles from '../styles/styles'

import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Lecture extends React.Component {
  render () {
    if (this.props.data.loading) {
      return (
        <View style={ styles.videoPlaceholder }>
          <Loading />
        </View>
      )
    }

    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    if (!this.props.data.Lesson) {
      return (<Text style={[ styles.textDefault, { margin: 35 } ]}>No more lessons</Text>)
    }

    return (
      <View style={{ width: '100%' }}>
        <Text
          style={[ styles.textDefault, {
            margin: 30,
            width: 200,
            alignSelf: 'center'
          }]}>
          Watch video and wait for the question
        </Text>
        <LectureVideoWithRouter lesson={this.props.data.Lesson} />
      </View>
    )
  }
}

class LectureVideo extends React.Component {
  state: Object;
  constructor (props: Object) {
    super(props)
    this.state = {
      isReady: false
    }
  }
  render () {
    return (
      <YouTube
        ref='youtubePlayer'
        videoId={this.props.lesson.youtubeId}
        play={false}
        hidden={false}
        fullscreen={true}
        loop={false}
        showinfo={false}
        modestbranding={false}
        rel={false}
        onChangeState={this._onChangeState}
        style={{alignSelf: 'stretch', height: 300, backgroundColor: '#000'}}
      />
    )
  }

  _onChangeState = (event) => {
    console.log('Gozdecki: event', event)
    if (event.state === 'ended') {
      this.props.history.push('/wellDone')
    }
  }
}

const LectureVideoWithRouter = withRouter(LectureVideo)

export default graphql(currentLessonQuery, {
  options: {
    fetchPolicy: 'network-only'
  }
})(Lecture)
