import React from 'react'
import { Circle } from 'rc-progress'

export default class SessionSummary extends React.Component {
  render () {
    const { newFlashcards, dueFlashcards, reviewFlashcards } = this.props

    const newFlashcardsProgress = toPercent(newFlashcards.done, newFlashcards.total)
    const dueFlashcardsProgress = toPercent(dueFlashcards.done, dueFlashcards.total)
    const reviewFlashcardsProgress = toPercent(reviewFlashcards.done, reviewFlashcards.total)

    return (
      <div>
        <div className="session-summary">
          New: {newFlashcards.done} / {newFlashcards.total}
          <Circle className="progress-bar"
                percent={newFlashcardsProgress}
                trailWidth="4"
                strokeWidth="18"
                strokeColor="#C8B600"
                trailColor="#AA9F39"
                strokeLinecap="square"
          />
        </div>

        { (dueFlashcards.total > 0) &&
          <div className="session-summary">
            Due: {dueFlashcards.done} / {dueFlashcards.total}
            <Circle className="progress-bar"
                    percent={dueFlashcardsProgress}
                    trailWidth="4"
                    strokeWidth="18"
                    strokeColor="#FF0000"
                    trailColor="#AA3939"
                    strokeLinecap="square"
            />
          </div>
        }

        <div className="session-summary">
          Review: {reviewFlashcards.done} / {reviewFlashcards.total}
          <Circle className="progress-bar"
                  percent={reviewFlashcardsProgress}
                  trailWidth="4"
                  strokeWidth="18"
                  strokeColor="#0388A7"
                  trailColor="#303E73"
                  strokeLinecap="square"
          />
        </div>
        <br />
      </div>
    )
  }
}

function toPercent (partition = 0, total = 0) {
  if (total === 0) return 0

  return partition / total * 100
}
