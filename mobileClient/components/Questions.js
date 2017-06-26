// @flow

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'react-router'
import {
    Text,
    View
} from 'react-native'

import Flashcard from './Flashcard'
import CourseHeader from './CourseHeader'
import AnswerEvaluator from './AnswerEvaluator'
import ProgressBar from './ProgressBar'
import Loading from './Loading'

import { updateAnswerVisibility } from '../actions/FlashcardActions'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'
import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount'

class Questions extends React.Component {
  constructor (props) {
    super(props)
    props.dispatch(updateAnswerVisibility(false))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentItems.loading || nextProps.currentUser.loading || nextProps.sessionCount.loading) {
      return
    }

    const itemsWithFlashcard = nextProps.currentItems.ItemsWithFlashcard

    if (itemsWithFlashcard.length > 0) {
      return
    }

    if (nextProps.currentUser.activated) {
      nextProps.history.push('/')
    } else {
      nextProps.history.push('/signup')
    }
  }

  goHome = () => {
    this.props.history.push('/')
  }

  render () {
    if (this.props.currentItems.loading || this.props.currentUser.loading || this.props.sessionCount.loading) {
      return <Loading />
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard
      const sessionCount = this.props.sessionCount.SessionCount

      if (itemsWithFlashcard.length > 0) {
        const flashcard = itemsWithFlashcard[0].flashcard
        const evalItem = itemsWithFlashcard[0].item

        const done = sessionCount.newDone + sessionCount.dueDone + sessionCount.reviewDone
        const total = sessionCount.newTotal + sessionCount.dueTotal + sessionCount.reviewTotal
        const progress = done / total

        const courseColor = _.get(this.props.course, 'selectedCourse.color')

        return (
          <View style={{ backgroundColor: courseColor }}>
            <CourseHeader onLogoPress={this.goHome}>
              <ProgressBar progress={progress} />
            </CourseHeader>

            <Flashcard question={flashcard.question} answer={flashcard.answer}
              evalItemId={evalItem._id} />
            <AnswerEvaluator enabled={this.props.flashcard.visibleAnswer} evalItemId={evalItem._id} />
          </View>
        )
      } else {
        return <Text>no flashcards left</Text>
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
        graphql(currentUserQuery, {name: 'currentUser'}),
        graphql(currentItemsQuery, {
          name: 'currentItems',
          options: {
            fetchPolicy: 'network-only'
          }
        }
        ),
        graphql(sessionCountQuery, {
          name: 'sessionCount',
          options: {
            fetchPolicy: 'network-only'
          }
        })
    )(connect(state => state)(Questions))
)
