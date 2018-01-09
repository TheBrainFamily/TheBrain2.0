// @flow

import React from 'react'
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native'

import Loading from './Loading'

import styles from '../styles/styles'
import YoutubeLoader from '../AppYtLoader'

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
    // If the video is already attached through the webkit we need to detach and and reatach it in componentDidUpdate
    // hacky, but till expo has native functionality for youtube, this is the best I could come up with for a good UX
    // As far as I saw - there is no way as of Jan 9th 2018 to figure out whether we are in a fullscreen, or differentiate
    // between closing the fullscreen and pausing.
    if (this.state.playVideo) {
      this.setState({playVideo: false})
    } else {
      this.setState({playVideo: true})
      this.setState({loading: true})
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.playVideo === true && this.state.playVideo === false) {
      this.setState({playVideo: true})
      this.setState({loading: true})
    }
  }

  onPaused = () => {
    this.setState({loading: false})
  }
  onFinished = () => {
    this.setState({playVideo: false})
    this.props.onVideoWatched({event: {state: 'ended'}})
  }

  render () {
    return (
      <TouchableWithoutFeedback
        onPress={this.playVideo}
        activeOpacity={1}
        underlayColor='#fff'
      >
        <View style={{height: '100%'}}>
          <View style={styles.videoPlaceholder}>
            <Image resizemode={'cover'}
                   style={{height: this.props.height, width: '100%', justifyContent: 'center'}}
                   source={{uri: `https://img.youtube.com/vi/${this.props.videoId}/0.jpg`}}
            >
            </Image>
          </View>
          {this.state.loading ? <Loading/> : null}
          {this.state.playVideo ? <YoutubeLoader videoId={this.props.videoId}
                                                 onFinished={this.onFinished.bind(this)}
                                                 onPaused={this.onPaused.bind(this)}
                                                 style={{display: 'none', backgroundColor: 'black'}}

          /> : null}
        </View>
      </TouchableWithoutFeedback>

    )
  }
}
