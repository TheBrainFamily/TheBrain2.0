// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
// import {compose} from 'recompose';
import _ from 'lodash'
import { push } from 'react-router-redux'

import Flashcard from './Flashcard'
import SessionSummary from './SessionSummary'
import currentUserQuery from 'queries/currentUser'

class Questions extends React.Component {
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

      if (itemsWithFlashcard.length > 0) {
        const flashcard = itemsWithFlashcard[0].flashcard
        const evalItem = itemsWithFlashcard[0].item
        const itemsCounter = _.countBy(itemsWithFlashcard, (itemWithFlashcard) => {
          if (itemWithFlashcard.item.extraRepeatToday) {
            return 'extraRepeat'
          }
          if (itemWithFlashcard.item.actualTimesRepeated === 0) {
            return 'newFlashcard'
          }
          return 'repetition'
        })

        return <div className='questions'>
          <SessionSummary newFlashcards={{ done: 0, todo: itemsCounter.newFlashcard || 0 }}
                          repetitions={{ done: 0, todo: itemsCounter.repetition || 0 }}
                          extraRepetitions={{ done: 0, todo: itemsCounter.extraRepeat || 0 }}
          />
          <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id} />
        </div>
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
