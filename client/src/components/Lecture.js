import React from 'react'
import YouTube from 'react-youtube'
import Introduction from './Introduction'
import Content from './Content'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'

class Lecture extends React.Component {

  render() {

    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    return <div id="video">
      <Introduction />
      <Content />
      <LectureVideoWithRouter lesson={this.props.data.Lesson} />
    </div>
  }
}
class LectureVideo extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }

    return (
      <YouTube
        videoId={this.props.lesson.youtubeId}
        opts={opts}
        onEnd={this._onEnd}
      />
    )
  }

  _onEnd = () => {
    this.props.history.push('/wellDone')
  }
}

const LectureVideoWithRouter = withRouter(LectureVideo)

const query = gql`
    query Lesson {
        Lesson {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`

export default graphql(query)(Lecture)

