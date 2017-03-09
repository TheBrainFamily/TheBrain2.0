import { render } from 'react-dom';
import React from 'react';



Meteor.startup(() => {
    render(<Video />, document.getElementById('app'));
});


class Video extends React.Component {
    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
            },
        };

        return (
            <YouTube
                videoId="QnQe0xW_JY4"
                opts={opts}
                onEnd={this.onEnd}
            />
        );
    }

    onEnd() {
        console.log('hello world');
    }
}