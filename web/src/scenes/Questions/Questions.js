// @flow

import React from 'react'

import Flashcard from './components/Flashcard/Flashcard'
import ProgressBar from '../../components/ProgressBar'
import { questionsWrapper } from './questionsWrapper'

class Questions extends React.Component {
  render () {
    if (this.props.sessionCount.loading) {
      return <p>Loading...</p>
    } else if (!this.props.selectedCourse) {
      return <div>Course not selected</div>
    } else {
      const sessionCount = this.props.sessionCount.SessionCount
      const done = sessionCount.newDone + sessionCount.dueDone + sessionCount.reviewDone
      const total = sessionCount.newTotal + sessionCount.dueTotal + sessionCount.reviewTotal
      const progress = done / total

      return (
        <span>
          <ProgressBar progress={progress} label={'TODAY\'S PROGRESS'} width={1024}
            category={this.props.selectedCourse.name} />
          <Flashcard />
        </span>)
    }
  }
}

export default questionsWrapper(Questions)
