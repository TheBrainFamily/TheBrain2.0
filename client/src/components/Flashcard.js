import React from 'react';

export default class extends React.Component {

    render() {
        return <div>
            <div className="center flashcard">QUESTION : <br/><br/><br/>{this.props.question}</div>
            <div className="center flashcard answer">CORRECT ANSWER :<br/><br/>{this.props.answer}
            </div>
            <button className="button-answer">Blackout</button>
            <button className="button-answer">Terrible</button>
            <button className="button-answer">Bad</button>
            <button className="button-answer">Hardly</button>
            <button className="button-answer">Good</button>
            <button className="button-answer">Perfect!</button>
        </div>
    }
}
