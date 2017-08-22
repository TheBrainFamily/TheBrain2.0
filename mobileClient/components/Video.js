// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Image, Platform, Text, TouchableWithoutFeedback, View } from 'react-native'
import Orientation from 'react-native-orientation'

import Loading from './Loading'

import styles from '../styles/styles'

export default class Video extends React.Component {
  static defaultProps = {
    height: '75%',
    onChangeState: () => {}
  }
  state = {
    playVideo: false,
    videoState: ''
  }
  playVideo = () => {
    this.setState({ playVideo: true })
  }
  onChangeState = (event: Object) => {
    this.setState({ videoState: event.state })
    if (event.state === 'ended') {
      this.setState({ playVideo: false })
      if (Platform.OS === 'android') {
        Orientation.lockToPortrait()
      }
    }
    this.props.onChangeState && this.props.onChangeState(event)
  }
  onChangeFullscreen = (event: Object) => {
    if (this.state.videoState === 'paused' && !event.isFullscreen) {
      this.setState({ playVideo: false })
    }
  }

  render () {
    return (
      <TouchableWithoutFeedback
        onPress={this.playVideo}
        activeOpacity={1}
        underlayColor='#fff'
      >
        <View style={{ height:'100%' }}>
          {this.state.playVideo && !this.props.loading ?
            <YouTube
              ref='youtubePlayer'
              videoId={this.props.videoId}
              hidden={false}
              fullscreen
              play
              loop={false}
              showinfo={false}
              modestbranding={false}
              rel={false}
              onChangeState={this.onChangeState}
              onChangeFullscreen={this.onChangeFullscreen}
              style={{ width: '100%', height: '100%', backgroundColor: '#000'}}
              apiKey='AIzaSyAp-SF0w9lATiBVdEfVPYikwyBC3s7gWps'
            />
            :
            this.props.hasOwnProperty('loading') && this.props.loading ?
              <View style={styles.videoPlaceholder}>
                <Loading />
              </View>
              :
              <View style={styles.videoPlaceholder}>
                <Image resizemode={'cover'} style={{height: this.props.height, width: '100%', justifyContent: 'center'}}
                       source={{uri:`https://img.youtube.com/vi/${this.props.videoId}/0.jpg`}}
                >
                  <Text style={[styles.textDefault, styles.videoPlaceholderText]}>Tap to play video</Text>
                </Image>
              </View>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
