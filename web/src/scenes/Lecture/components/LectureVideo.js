import React from 'react'
import YouTube from 'react-youtube'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'react-apollo'

export class LectureVideo extends React.Component {
  render () {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }

    return (
      <YouTube
        className={'youTube-player'}
        videoId={this.props.lesson.youtubeId}
        opts={opts}
        onEnd={this.props.onEnd}
      />
    )
  }
}

export default compose(
  withRouter,
  connect()
)(LectureVideo)
