import React from 'react';

export default class extends React.Component {
    render() {
        return <div>
            <div className="flashcard question">{this.props.question}</div>
            <div className="flashcard answer">{this.props.answer}
            </div>
        </div>
    }
}