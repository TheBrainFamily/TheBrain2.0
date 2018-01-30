// @flow

import React from 'react'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { graphql, compose } from 'react-apollo'

import Card from './Card'
import type { Direction } from '../helpers/SwipeHelpers'
import { DIRECTIONS } from '../helpers/SwipeHelpers'

import {
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  View,
  Text,
  Image
} from 'react-native'

import styles from '../styles/styles'
import { updateAnswerVisibility } from '../actions/FlashcardActions'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'

class Flashcard extends React.Component {
  state: {
    windowDimensions: {
      width: number,
      height: number,
    },
    dynamicStyles: {
      content: Object,
    },
    swipeDirection: Direction,
    dragLen: number,
  }

  constructor (props: Object) {
    super(props)
    const windowDimensions = Dimensions.get('window')
    this.state = {
      windowDimensions: {
        width: windowDimensions.width,
        height: windowDimensions.height
      },
      dynamicStyles: {
        content: { height: this.props.getFlashcardHeight(), width: this.props.getFlashcardWidth() }
      },
      swipeDirection: DIRECTIONS.left,
      dragLen: 0,
      currentQuestion: props.question,
      currentAnswer: props.answer
    }
    this.animatedValue = new Animated.Value(0)
    this.animatedValue.addListener(({value}) => this.eventLauncher(value))
    this.frontInterpolate = this.interpolateWrapper({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    })
    this.flipEventLaunched = false
    this.isAnswerCurrentlyVisible = false
  }

  eventLauncher = (value) => {
    if (!this.flipEventLaunched) {
      if (this.isAnswerCurrentlyVisible) {
        if (value < 90.0) {
          this.flipEventLaunched = true
          this.isAnswerCurrentlyVisible = false
          this.props.dispatch(updateAnswerVisibility(false))
          this.updateFlashcardContent(this.props)
        }
      } else {
        if (value > 90.0) {
          this.flipEventLaunched = true
          this.isAnswerCurrentlyVisible = true
          this.props.dispatch(updateAnswerVisibility(true))
          this.updateFlashcardContent(this.props)
        }
      }
    }
  }

  updateFlashcardContent = (props) => {
    this.setState({
      currentQuestion: props.question,
      currentAnswer: props.answer
    })
  }

  interpolateWrapper = ({ inputRange, outputRange }) => {
    return this.animatedValue.interpolate({
      inputRange,
      outputRange
    })
  }

  animate = () => {
    const toAnswerSide = 180
    const toQuestionSide = 0
    const value = this.isAnswerCurrentlyVisible ? toQuestionSide : toAnswerSide
    Animated.spring(this.animatedValue, {
      toValue: value,
      friction: 8,
      tension: 10
    }).start()
  }

  flipCard = () => {
    this.flipEventLaunched = false
    this.animate()
    this.setState({
      dynamicStyles: {
        content: { height: this.props.getFlashcardHeight(), width: this.props.getFlashcardWidth() }
      }
    })
  }

  componentWillUpdate = (nextProps) => {
    if (nextProps.flashcard.visibleAnswer !== this.props.flashcard.visibleAnswer) {
      this.isAnswerCurrentlyVisible = this.props.flashcard.visibleAnswer
      this.flipCard()
    }

    if (nextProps.question !== this.props.question) {
      // currently we simulate delays of props update by launching events on animation listener actions
      // (it takes about 120ms to rotate the card 90 deg and then update the flashcard
      // but passed props may become out of sync with the state (which is passed to children).
      // Instead of handling all those situations everywhere (eg. setUserIsCasualMutation and Items refetch)
      // we make sure it comes in sync after 300ms - in typical use cases it is invisible to user and
      // patches all other use cases where props come out of sync.
      setTimeout(() => {
        this.updateFlashcardContent(nextProps)
      }, 300)
    }
  }

  onLayout = () => {
    const { width, height } = Dimensions.get('window')
    this.setState({
      windowDimensions: {
        width,
        height
      },
      dynamicStyles: {
        content: { height: this.props.getFlashcardHeight(), width: this.props.getFlashcardWidth() }
      }
    })
  }

  render = () => {
    const frontAnimatedStyle = {
      transform: [
        { rotateY: this.frontInterpolate }
      ]
    }

    return (
      <TouchableWithoutFeedback testID='flashcard_side' onPress={() =>
        this.props.userDetails.UserDetails.isCasual !== null || this.props.isQuestionCasual ? this.flipCard() : null}>
        <Animatable.View onLayout={this.onLayout} animation='zoomInLeft'>
          <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
            <View style={styles.flipCardContainer}>
              <Card dynamicStyles={this.state.dynamicStyles}
                question={this.state.currentQuestion} answer={this.state.currentAnswer}
                image={this.props.image}
                answerImage={this.props.answerImage}
                visibleAnswer={this.isAnswerCurrentlyVisible}
                isCasualFlashcard={this.props.isQuestionCasual} />
              <View
                style={{ width: '90%', alignItems: 'flex-end', marginLeft: 0, flexDirection: 'row', marginTop: -1 }}>
                <View style={{
                  width: (this.state.windowDimensions.width * 0.9) - 200,
                  height: '100%',
                  backgroundColor: 'white'
                }}><Text /></View>
                <Image style={{ width: 200, height: 22.5 }} source={require('../images/pageCorner.png')} />
              </View>
            </View>
          </Animated.View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    )
  }
}

export default compose(
  graphql(userDetailsQuery, { name: 'userDetails' })
)(connect(state => state)(Flashcard))
