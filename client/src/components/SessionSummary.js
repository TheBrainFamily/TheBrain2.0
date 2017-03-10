import React from 'react';

export default class extends React.Component {
    render() {
        const {newFlashcards, repetitions, extraRepetitions} = this.props;
        return <div>
            <div>Left {newFlashcards.todo} / {newFlashcards.todo + newFlashcards.done} </div>
            <div>Done: {repetitions.todo} / {repetitions.todo + repetitions.done}</div>
            <div>To be repeated {extraRepetitions.todo} / {extraRepetitions.todo + extraRepetitions.done}</div>
        </div>
    }
}