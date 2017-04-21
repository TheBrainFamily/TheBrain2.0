import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
// import {compose} from 'recompose';
import _ from 'lodash'
import { push } from 'react-router-redux'

import store from '../store'
import Flashcard from './Flashcard'
import SessionSummary from './SessionSummary'
import currentUserQuery from 'queries/currentUser'

class Questions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    if (this.props.currentItems.loading || this.props.currentUser.loading) {
      return <div>Loading...</div>
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard

      if (itemsWithFlashcard.length > 0) {
        const flashcard = itemsWithFlashcard[ 0 ].flashcard
        const evalItem = itemsWithFlashcard[ 0 ].item
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
        if (this.props.currentUser.activated) {
          store.dispatch(push('/'))
        } else {
          store.dispatch(push('/signup'))
        }
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

export default withRouter(
  compose(
    graphql(currentUserQuery, { name: 'currentUser' }),
    graphql(currentItemsQuery, {
        name: 'currentItems',
        options: {
          forceFetch: true
        }
      }
    )
  )(Questions)
)
