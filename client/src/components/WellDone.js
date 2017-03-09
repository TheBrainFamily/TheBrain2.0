import React from 'react';

import { Link } from 'react-router';

// const createMessage = gql`
//     mutation addMessage($channelName: String!, $handle: String!, $message: String!) {
//         addMessage(channelName: $channelName, handle: $handle, message:$message) {
//             handle, message
//         }
//     }`;
//

export default class extends React.Component {
    componentDidMount() {

    }
    render() {
        return <div className="welldone">
            First video done! Click: <Link to={`/questions`}>here</Link> to answer some questions about the video
        </div>
    }
}