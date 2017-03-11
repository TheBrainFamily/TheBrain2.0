import React from 'react';

export default class extends React.Component {
    render() {
        const {newFlashcards, repetitions, extraRepetitions} = this.props;
        return <div>
            <div className="session-summary">Left {newFlashcards.todo} / {newFlashcards.todo + newFlashcards.done} </div>
            <div className="session-summary">Done: {repetitions.todo} / {repetitions.todo + repetitions.done}</div>
            <div className="session-summary">To be repeated {extraRepetitions.todo} / {extraRepetitions.todo + extraRepetitions.done}</div>
            <br/>
        </div>
    }
}