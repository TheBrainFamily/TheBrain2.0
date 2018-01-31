import React from 'react'
import YouTube from 'react-youtube'

export class VideoPreview extends React.Component {
  state = {previewMode: true}
  opts = {
    height: '240',
    width: '320',
    opacity: 0.2,
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  }

  render () {
    const cursor = this.props.locked ? '' : 'pointer'

    return (
      <div key={this.props.lesson.youtubeId} style={{
        display: 'inline-block',
        margin: '1%',
        opacity: this.props.lesson.position > this.props.currentLesson.Lesson.position ? 0.5 : 1
      }}>
        {this.state.previewMode ? <img alt='togglePreviewMode'
          onClick={() => {
            if (!this.props.locked) {
              this.setState({previewMode: false})
            }
          }}
          style={{
            height: '240px',
            width: '320px',
            justifyContent: 'center',
            cursor: cursor
          }}
          src={`https://img.youtube.com/vi/${this.props.lesson.youtubeId}/0.jpg`}
        /> : <YouTube
          className={'youTube-player'}
          videoId={this.props.lesson.youtubeId}
          opts={this.opts}
        />}
      </div>)
  }
}
