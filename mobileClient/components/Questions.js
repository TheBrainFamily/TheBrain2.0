// @flow

import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router'
import update from 'immutability-helper'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  BackHandler
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

import currentUserQuery from '../shared/graphql/queries/currentUser'
import currentItemsQuery from '../shared/graphql/queries/itemsWithFlashcard'
import sessionCountQuery from '../shared/graphql/queries/sessionCount'
import closeCourseMutation from '../shared/graphql/mutations/closeCourse'
import WithData from './WithData'
import { mutationConnectionHandler } from './NoInternet'
import * as mainMenuActions from '../actions/MainMenuActions'

class Questions extends React.Component {
  constructor (props) {
    super(props)
    props.dispatch(updateAnswerVisibility(false))
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    if(this.props.mainMenu.visible) {
      this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
        visible: false
      }))
      return true
    }
    this.closeCourse()
    return true
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
    // console.log(nextProps.currentItems)
    if (nextProps.currentUser.CurrentUser && nextProps.currentUser.CurrentUser.activated) {
      // console.log('redirecting / ')
      nextProps.history.push('/')
    } else {
      // console.log('redirecting /login ')
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

  closeCourse = async () => {
    await mutationConnectionHandler(this.props.history, async () => {
      this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
        visible: false
      }))
      await this.props.closeCourse()
      this.props.dispatch(courseActions.close())
    })
  }

  render () {
    const courseColor = _.get(this.props.course, 'selectedCourse.color')
    if (this.props.currentItems.loading || this.props.currentUser.loading || this.props.sessionCount.loading) {
      return <Loading backgroundColor={courseColor} />
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard
      const sessionCount = this.props.sessionCount.SessionCount

      if (itemsWithFlashcard && itemsWithFlashcard.length > 0) {
        const flashcard = itemsWithFlashcard[0].flashcard
        const evalItem = itemsWithFlashcard[0].item

        const done = sessionCount.newDone + sessionCount.dueDone + sessionCount.reviewDone
        const total = sessionCount.newTotal + sessionCount.dueTotal + sessionCount.reviewTotal
        const progress = done / total

        return (
          <View style={{ backgroundColor: courseColor }}>
            <CourseHeader isExitAnimationFinished={true} closeCourse={this.closeCourse}>
              <ProgressBar progress={progress}/>
            </CourseHeader>

            <Flashcard question={flashcard.question}
                       answer={flashcard.answer}
                       image={flashcard.image}
                       answerImage={flashcard.answerImage}
                       evalItemId={evalItem._id}
                       getFlashcardHeight={this.getFlashcardHeight}
                       getFlashcardWidth={this.getFlashcardWidth}
                       isQuestionCasual={flashcard.isCasual}/>
            <AnswerEvaluator isQuestionCasual={flashcard.isCasual} enabled={this.props.flashcard.visibleAnswer}
                             evalItemId={evalItem._id}
                             getAnswerEvaluatorHeight={this.getAnswerEvaluatorHeight}/>
            {this.props.mainMenu.visible &&
            <MainMenu topMargin={this.props.height} closeCourse={this.closeCourse}/>}
          </View>
        )
      } else {
        return <Text>no flashcards left</Text>
      }
    }
  }
}

export default compose(
  connect(state => state),
  withRouter,
  graphql(currentUserQuery, { name: 'currentUser' }),
  graphql(currentItemsQuery, {
    name: 'currentItems',
    options: {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true //workaround to infininte loading after user relog in apoolo-client > 1.8
    }
  }),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(closeCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      closeCourse: () => mutate({
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
            // console.log('mutation close course: ', mutationResult.data.closeCourse)
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.closeCourse
              }
            })
          }
        },
      })
    })
  }),
  connect(state => state)
)(WithData(Questions, ['currentUser', 'currentItems', 'sessionCount']))
