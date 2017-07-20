// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Flashcard from './Flashcard'
import currentUserQuery from '../../shared/graphql/queries/currentUser'
import sessionCountQuery from '../../shared/graphql/queries/sessionCount'
import ProgressBar from './ProgressBar'

class Questions extends React.Component {
  componentWillReceiveProps (nextProps) {

    if (!nextProps.selectedCourse) {
      nextProps.dispatch(push('/'))
    }

    if (nextProps.currentItems.loading || nextProps.currentUser.loading || nextProps.sessionCount.loading) {
      return
    }
    const itemsWithFlashcard = nextProps.currentItems.ItemsWithFlashcard

    if (itemsWithFlashcard.length > 0) {
      return
    }

    if (nextProps.currentUser.activated) {
      nextProps.dispatch(push('/'))
    } else {
      nextProps.dispatch(push('/signup'))
    }
  }

  render () {
    if (this.props.currentItems.loading || this.props.currentUser.loading || this.props.sessionCount.loading) {
      return <div>Loading...</div>
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard
      const sessionCount = this.props.sessionCount.SessionCount

      if (itemsWithFlashcard.length > 0) {
        const flashcard = itemsWithFlashcard[0].flashcard
        const evalItem = itemsWithFlashcard[0].item

        const done = sessionCount.newDone + sessionCount.dueDone + sessionCount.reviewDone
        const total = sessionCount.newTotal + sessionCount.dueTotal + sessionCount.reviewTotal
        const progress = done / total

        return (
          <span>
          <ProgressBar progress={progress} label={'TODAY\'S PROGRESS'} width={1024}
                       category={this.props.selectedCourse.name}/>
          <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id}/>
        </span>)
      } else {
        return <div />
      }
    }
  }
}

const currentItemsQuery = gql`
    query CurrentItems {
        ItemsWithFlashcard {
            item {
                _id
                flashcardId
                extraRepeatToday
                actualTimesRepeated
            }
            flashcard
            {
                _id question answer
            }
        }
    }
`

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps),
  graphql(currentUserQuery, {name: 'currentUser'}),
  graphql(currentItemsQuery, {
    name: 'currentItems',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Questions)
