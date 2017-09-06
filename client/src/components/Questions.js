// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import Flashcard from './Flashcard'
import sessionCountQuery from '../../shared/graphql/queries/sessionCount'
import ProgressBar from './ProgressBar'

class Questions extends React.Component {
  render () {
    if (this.props.sessionCount.loading) {
      return <div>Loading...</div>
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
                     category={this.props.selectedCourse.name}/>
        <Flashcard/>
      </span>)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Questions)
