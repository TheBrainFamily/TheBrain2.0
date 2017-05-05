import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Flashcard from './Flashcard'
import SessionSummary from './SessionSummary'
import currentUserQuery from 'queries/currentUser'
import getItemsWithFlashcardsByCount from 'helpers/getItemsWithFlashcardsByCount'

class Questions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentItems.loading || nextProps.currentUser.loading) {
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
    if (this.props.currentItems.loading || this.props.currentUser.loading) {
      return <div>Loading...</div>
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard

      if (!itemsWithFlashcard.length > 0) {
        return <div />
      }

      const flashcard = itemsWithFlashcard[0].flashcard
      const evalItem = itemsWithFlashcard[0].item

      const itemsWithFlashcardsByCount = getItemsWithFlashcardsByCount(itemsWithFlashcard)
      console.log('* LOG * itemsWithFlashcardsByCount', itemsWithFlashcardsByCount)
      const newFlashcards = { done: itemsWithFlashcardsByCount.newDone, total: itemsWithFlashcardsByCount.newTotal }
      const dueFlashcards = { done: itemsWithFlashcardsByCount.dueDone, total: itemsWithFlashcardsByCount.dueTotal }
      const reviewFlashcards = { done: itemsWithFlashcardsByCount.reviewDone, total: itemsWithFlashcardsByCount.reviewTotal }

      return (
        <div className='questions'>
          <SessionSummary newFlashcards={newFlashcards} dueFlashcards={dueFlashcards} reviewFlashcards={reviewFlashcards} />
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
                timesRepeated
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
      forceFetch: true
    }
  })
)(Questions)
