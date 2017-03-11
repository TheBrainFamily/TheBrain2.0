import React from 'react';
import { Line, Circle } from 'rc-progress';

export default class extends React.Component {
    render() {
        const {newFlashcards, repetitions, extraRepetitions} = this.props;

        const left = `${newFlashcards.todo + newFlashcards.done}`;
        const done = `${repetitions.todo} / ${repetitions.todo + repetitions.done}`;
        const toBeRepeated = `${extraRepetitions.todo} / ${extraRepetitions.todo + extraRepetitions.done}`;

        return <div>

            <div className="session-summary">Left: </div>
            <Circle className="progress-bar" percent={left} trailWidth="4" strokeWidth="18" strokeColor="#C8B600" trailColor="#AA9F39" strokeLinecap="square"/>

            <div className="session-summary">Done: </div>
            <Circle className="progress-bar" percent={done} trailWidth="4" strokeWidth="18" strokeColor="#FF0000" trailColor="#AA3939" strokeLinecap="square"/>

            <div className="session-summary">To be repeated:</div>
            <Circle className="progress-bar" percent={toBeRepeated} trailWidth="4" strokeWidth="18" strokeColor="#0388A7" trailColor="#303E73" strokeLinecap="square"/>
            <br/>
        </div>
    }
}