// @flow

import React from 'react'
import YouTube from 'react-native-youtube'

export default class Video extends React.Component {
  render () {
    return (
      <YouTube
        ref='youtubePlayer'
        videoId={this.props.videoId}
        play={false}
        hidden={false}
        fullscreen
        loop={false}
        showinfo={false}
        modestbranding={false}
        rel={false}
        onChangeState={this.props.onChangeState}
        style={{ alignSelf: 'stretch', height: this.props.height, backgroundColor: '#000' }}
      />
    )
  }
}

Video.defaultProps = {
  height: 300,
  onChangeState: () => {}
}
