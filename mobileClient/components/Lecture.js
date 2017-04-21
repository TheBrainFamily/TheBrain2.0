// @flow

import React from 'react';
import YouTube from 'react-native-youtube';
import { Text, View, StyleSheet } from 'react-native';
// import Introduction from './Introduction';
// import Content from './Content';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter, Link } from 'react-router-native'


class Lecture extends React.Component {


    render() {

        if (this.props.data.loading) {
            return (<Text>Loading...</Text>)
        }

        if (this.props.data.error) {
            return (<Text>Error...</Text>)
        }

        return <LectureVideoWithRouter lesson={this.props.data.Lesson}/>
    }
}

class LectureVideo extends React.Component {
    state: Object;
    constructor(props: Object) {
      super(props);
      this.state = {
        isReady: false,
      };
    }
    render() {
        // const opts = {
        //     height: '390',
        //     width: '640',
        //     playerVars: { // https://developers.google.com/youtube/player_parameters
        //         autoplay: 0
        //     }
        // };

        return (
            <YouTube
                ref="youtubePlayer"
                videoId={this.props.lesson.youtubeId} // The YouTube video ID
                play={true}           // control playback of video with true/false
                hidden={false}        // control visiblity of the entire view
                playsInline={false}    // control whether the video should play inline
                loop={false}          // control whether the video should loop when ended
                showinfo={false}
                modestbranding={false}
                rel={false}

                onReady={(e)=>{this.setState({isReady: true})}}
                onChangeState={this._onChangeState}
                onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
                onError={(e)=>{this.setState({error: e.error})}}
                onProgress={(e)=>{this.setState({currentTime: e.currentTime, duration: e.duration})}}

                style={{alignSelf: 'stretch', height: 300, backgroundColor: 'red', marginVertical: 10}}
            />

        );
    }

    _onChangeState = (event) => {
        console.log("Gozdecki: event",event);
        if (event.state === "ended") {
            this.props.history.push("/wellDone");
        }
    }
}

const LectureVideoWithRouter = withRouter(LectureVideo);

const query = gql`
    query Lesson {
        Lesson {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`;

// export default Lecture;

export default graphql(query)(Lecture);

