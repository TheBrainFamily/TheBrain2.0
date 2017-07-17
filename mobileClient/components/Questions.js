// @flow

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'

import Flashcard from './Flashcard'
import CourseHeader from './CourseHeader'
import AnswerEvaluator from './AnswerEvaluator'
import ProgressBar from './ProgressBar'
import Loading from './Loading'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'

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

  getHeaderHeight = () => {
    return appStyle.header.offset +
      appStyle.header.height + 22.5
  }

  getFlashcardHeight = () => {
    const windowDimensions = Dimensions.get('window')
    const elementHeight = (windowDimensions.height - this.getHeaderHeight()) * 0.39
    console.log('PINGWIN: elementHeight', elementHeight)
    return elementHeight
  }

  getAnswerEvaluatorHeight = () => {
    const windowDimensions = Dimensions.get('window')
    return windowDimensions.height - this.getHeaderHeight() - this.getFlashcardHeight() - StyleSheet.flatten(styles.flipCardContainer).marginBottom
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
          <View style={{backgroundColor: courseColor}}>
            <CourseHeader>
              <ProgressBar progress={progress}/>
            </CourseHeader>

            <Flashcard question={flashcard.question} answer={flashcard.answer}
                       evalItemId={evalItem._id} getFlashcardHeight={this.getFlashcardHeight}/>
            <AnswerEvaluator enabled={this.props.flashcard.visibleAnswer} evalItemId={evalItem._id}
                             getAnswerEvaluatorHeight={this.getAnswerEvaluatorHeight}/>
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
