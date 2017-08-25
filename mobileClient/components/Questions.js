// @flow

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native'

import MainMenu from './MainMenu'
import Flashcard from './Flashcard'
import CourseHeader from './CourseHeader'
import AnswerEvaluator from './AnswerEvaluator'
import ProgressBar from './ProgressBar'
import Loading from './Loading'

import * as courseActions from '../actions/CourseActions'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'

import { updateAnswerVisibility } from '../actions/FlashcardActions'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'
import currentItemsQuery from '../../client/shared/graphql/queries/ItemsWithFlashcard'
import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount'

class Questions extends React.Component {
  constructor (props) {
    super(props)
    props.dispatch(updateAnswerVisibility(false))
    this.state = {
      mainMenuActive: false
    }
  }

  toggleMainMenu = () => {
    this.setState({ mainMenuActive: !this.state.mainMenuActive })
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.course || !nextProps.course.selectedCourse) {
      nextProps.history.push('/')
    }

    if (nextProps.currentItems.loading || nextProps.currentUser.loading || nextProps.sessionCount.loading) {
      return
    }

    const itemsWithFlashcard = nextProps.currentItems.ItemsWithFlashcard

    if (nextProps.currentItems.loading || !itemsWithFlashcard || (itemsWithFlashcard && itemsWithFlashcard.length > 0)) {
      return
    }
    console.log(nextProps.currentItems)
    if (nextProps.currentUser.CurrentUser && nextProps.currentUser.CurrentUser.activated) {
      console.log('redirecting / ')
      nextProps.history.push('/')
    } else {
      console.log('redirecting /login ')
      nextProps.history.push('/login')
    }
  }

  getHeaderHeight = () => {
    const actionBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0
    return appStyle.header.offset +
      appStyle.header.height + actionBarHeight + 22.5
  }

  getFlashcardHeight = () => {
    const windowDimensions = Dimensions.get('window')
    const elementHeight = (windowDimensions.height - this.getHeaderHeight()) * 0.39
    return elementHeight
  }

  getFlashcardWidth = () => {
    const windowDimensions = Dimensions.get('window')
    const elementWidth = windowDimensions.width * 0.9
    return elementWidth
  }

  getAnswerEvaluatorHeight = () => {
    const windowDimensions = Dimensions.get('window')
    return windowDimensions.height - this.getHeaderHeight() - this.getFlashcardHeight() - StyleSheet.flatten(styles.flipCardContainer).marginBottom
  }

  closeCourse = () => {
    this.props.dispatch(courseActions.close())
    this.props.history.push('/')
  }

  render () {
    if (this.props.currentItems.loading || this.props.currentUser.loading || this.props.sessionCount.loading) {
      return <Loading />
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard
      const sessionCount = this.props.sessionCount.SessionCount

      if (itemsWithFlashcard && itemsWithFlashcard.length > 0) {
        const flashcard = itemsWithFlashcard[0].flashcard
        const evalItem = itemsWithFlashcard[0].item

        const done = sessionCount.newDone + sessionCount.dueDone + sessionCount.reviewDone
        const total = sessionCount.newTotal + sessionCount.dueTotal + sessionCount.reviewTotal
        const progress = done / total

        const courseColor = _.get(this.props.course, 'selectedCourse.color')

        return (
          <View style={{ backgroundColor: courseColor }}>
            <CourseHeader closeCourse={this.closeCourse} toggleMainMenu={this.toggleMainMenu}>
              <ProgressBar progress={progress}/>
            </CourseHeader>

            <Flashcard question={flashcard.question} answer={flashcard.answer} image={flashcard.image}
                       evalItemId={evalItem._id} getFlashcardHeight={this.getFlashcardHeight}
                       getFlashcardWidth={this.getFlashcardWidth}/>
            <AnswerEvaluator isQuestionCasual={flashcard.isCasual} enabled={this.props.flashcard.visibleAnswer} evalItemId={evalItem._id}
                             getAnswerEvaluatorHeight={this.getAnswerEvaluatorHeight}/>
            {this.state.mainMenuActive &&
            <MainMenu topMargin={this.props.height} closeCourse={this.props.closeCourse}/>}
          </View>
        )
      } else {
        return <Text>no flashcards left</Text>
      }
    }
  }
}

export default compose(
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
  }),
  connect(state => state)
)(Questions)
