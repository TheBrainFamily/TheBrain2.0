// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Flashcard from './Flashcard'
import SessionSummary from './SessionSummary'
import currentUserQuery from '../../shared/graphql/queries/currentUser'
import sessionCountQuery from '../../shared/graphql/queries/sessionCount'

class Questions extends React.Component {
  componentWillReceiveProps (nextProps) {
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

      if (!itemsWithFlashcard.length > 0) {
        return <div />
      }

      const flashcard = itemsWithFlashcard[0].flashcard
      const evalItem = itemsWithFlashcard[0].item

      return (
        <div className='questions-container'>
          <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id} />
        </div>
      )
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

export default compose(
  connect(),
  withRouter,
  graphql(currentUserQuery, { name: 'currentUser' }),
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
