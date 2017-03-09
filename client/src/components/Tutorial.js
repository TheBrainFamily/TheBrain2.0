import React, {PropTypes} from 'react';
import YouTube from 'react-youtube';
import Introduction from './Introduction';
import Content from './Content';
export default class extends React.Component {
    render() {
        return <div id="video">
            <Introduction/>
            <Content/>
            <TutorialVideo/></div>
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
                videoId='FSyAehMdpyI'
                opts={opts}
                onEnd={this._onEnd}
            />
        );
    }

    _onEnd = () => {
        this.context.router.transitionTo("/wellDone");
    }
}

