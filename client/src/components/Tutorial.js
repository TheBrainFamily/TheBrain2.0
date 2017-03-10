import React, {PropTypes} from 'react';
import YouTube from 'react-youtube';
import Introduction from './Introduction';
import Content from './Content';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';


class Tutorial extends React.Component {


    render() {
        
        if (this.props.data.loading) {
            return (<p>Loading...</p>)
        }

        if (this.props.data.error) {
            return (<p>Error...</p>)
        }

        return <div id="video">
            <Introduction/>
            <Content/>
            <TutorialVideo lesson={this.props.data.Lesson}/>
        </div>
    }
}

class TutorialVideo extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };

        return (
            <YouTube
                videoId={this.props.lesson.youtubeId}
                opts={opts}
                onEnd={this._onEnd}
            />
        );
    }

    _onEnd = () => {
        this.context.router.transitionTo("/wellDone");
    }
}

const query = gql`
    query Lesson($position:Int!) {
        Lesson(position:$position) {
            _id, position, description, flashcardIds, youtubeId
        }
    }
`;

export default graphql(query, {
    options: ownProps => {
        let lessonPosition = ownProps.params.lessonPosition ? ownProps.params.lessonPosition : 1;

        return ({variables: {position: lessonPosition}});
    },
})(Tutorial);

