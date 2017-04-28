import React from 'react'
import { Circle } from 'rc-progress'

export default class extends React.Component {
  render () {
    const { newFlashcards, repetitions, extraRepetitions } = this.props

    const left = ((newFlashcards.todo / (newFlashcards.todo + newFlashcards.done)) * 100) || 100
    const done = ((repetitions.todo / (repetitions.todo + repetitions.done)) * 100) || 100
    const toBeRepeated = ((extraRepetitions.todo / (extraRepetitions.todo + extraRepetitions.done)) * 100) || 100

    return <div>

      <div className="session-summary">Left: {newFlashcards.todo} / {newFlashcards.todo + newFlashcards.done}</div>
      <Circle className="progress-bar"
              percent={left}
              trailWidth="4"
              strokeWidth="18"
              strokeColor="#C8B600"
              trailColor="#AA9F39"
              strokeLinecap="square" />

      <div className="session-summary">Done: {repetitions.todo} / {repetitions.todo + repetitions.done} </div>
      <Circle className="progress-bar"
              percent={done}
              trailWidth="4"
              strokeWidth="18"
              strokeColor="#FF0000"
              trailColor="#AA3939"
              strokeLinecap="square" />

      <div className="session-summary">To be repeated: {extraRepetitions.todo}
        / {extraRepetitions.todo + extraRepetitions.done}</div>
      <Circle className="progress-bar"
              percent={toBeRepeated}
              trailWidth="4"
              strokeWidth="18"
              strokeColor="#0388A7"
              trailColor="#303E73"
              strokeLinecap="square" />
      <br />
    </div>
  }
}

function toPercent (partition = 0, total = 0) {
  if (total === 0) return 0

  return partition / total * 100
}
