// @flow

import React from 'react'
import YouTube from 'react-native-youtube'
import { Text, View, TouchableWithoutFeedback,Platform, Image } from 'react-native'
import styles from '../styles/styles'
import Orientation from 'react-native-orientation'

export default class Video extends React.Component {
    state = {
      playVideo: false
    }
  playVideo = () => {
    this.setState({ playVideo: true })
  }
  onChangeState = (event) => {
    console.log('Gozdecki: event', event)
    if (event.state === 'ended') {
      this.setState({ playVideo: false })
      if (Platform.OS === 'android') {
        Orientation.lockToPortrait()
      }
    }
    this.props.onChangeState && this.props.onChangeState(event)
  }
  render () {
    return (
    <TouchableWithoutFeedback onPress={this.playVideo}
                              activeOpacity={1}
                              underlayColor='#fff'>
      <View style={{ height:'100%' }}>
        {this.state.playVideo && !this.props.loading
        ? <YouTube
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
          style={{ backgroundColor: '#000'}}
          apiKey="AIzaSyAp-SF0w9lATiBVdEfVPYikwyBC3s7gWps"
          />
          : this.props.hasOwnProperty('loading') && this.props.loading ? <View style={styles.videoPlaceholder}>
            <Loading />
          </View> : <View style={styles.videoPlaceholder}>
            <Image resizemode={'cover'} style={{height: this.props.height, width: '100%', justifyContent: 'center'}}
                   source={{uri:`https://img.youtube.com/vi/${this.props.videoId}/0.jpg`}}>
            <Text style={[styles.textDefault, styles.videoPlaceholderText]}>Tap to play video</Text>
            </Image>
          </View>
        }
      </View>
    </TouchableWithoutFeedback>
    )
  }
}

Video.defaultProps = {
  height: "75%",
  onChangeState: () => {}
}
