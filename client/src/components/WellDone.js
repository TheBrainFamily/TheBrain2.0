import React from 'react';

import { Link } from 'react-router';
export default class extends React.Component {
    render() {
        return <div className="welldone">
            First video done! Click: <Link to={`/questions`}><b><u>here</u></b></Link> to answer some questions about the video
        </div>
    }
}