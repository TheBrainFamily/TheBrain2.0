import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Flashcard from './Flashcard'
import SessionSummary from './SessionSummary'
import currentUserQuery from 'queries/currentUser'

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

      const flashcardsByCount = getFlashcardsByCount(itemsWithFlashcard)

      const newFlashcardsTotal = flashcardsByCount.new + flashcardsByCount.review

      return (
        <div className='questions'>
          <SessionSummary newFlashcards={{ done: flashcardsByCount.review, total: newFlashcardsTotal }}
                          dueFlashcards={{ done: 0, total: flashcardsByCount.due }}
                          reviewFlashcards={{ done: 0, total: flashcardsByCount.review }}
          />
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

function getFlashcardsByCount (flashcards) {
  const flashcardsByCount = {
    'new': 0,
    'due': 0,
    'review': 0
  }

  flashcards.forEach((flashcard) => {
    if (flashcard.item.extraRepeatToday) {
      flashcardsByCount['review']++
    } else if (flashcard.item.actualTimesRepeated <= 1) {
      flashcardsByCount['new']++
    } else {
      flashcardsByCount['due']++
    }
  })

  return flashcardsByCount
}
