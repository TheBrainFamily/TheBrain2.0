// @flow

import React from 'react'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'

import Card from './Card'
import type { Direction } from '../helpers/SwipeHelpers'
import { DIRECTIONS } from '../helpers/SwipeHelpers'

import {
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  View,
  Text,
  Image,
} from 'react-native'

import styles from '../styles/styles'
import { updateAnswerVisibility } from '../actions/FlashcardActions'

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
      dragLen: 0
    }
    this.animatedValue = new Animated.Value(0)
    this.frontInterpolate = this.interpolateWrapper({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    })
  }

  interpolateWrapper = ({ inputRange, outputRange }) => {
    return this.animatedValue.interpolate({
      inputRange,
      outputRange
    })
  }

  // componentWillMount = () => {
  //   this.animatedValue = new Animated.Value(0)
  // };

  animate = () => {
    const toAnswerSide = 180
    const toQuestionSide = 0
    const value = this.props.flashcard.visibleAnswer ? toQuestionSide : toAnswerSide
    Animated.spring(this.animatedValue, {
      toValue: value,
      friction: 8,
      tension: 10
    }).start()
  }

  flipCard = () => {
    let answerWillBeVisible = false
    if (this.props.flashcard.visibleAnswer) {
      answerWillBeVisible = false
      this.props.dispatch(updateAnswerVisibility(answerWillBeVisible))
    } else {
      answerWillBeVisible = true
      this.props.dispatch(updateAnswerVisibility(answerWillBeVisible))
    }
    this.setState({
      dynamicStyles: {
        content: { height: this.props.getFlashcardHeight(), width: this.props.getFlashcardWidth() }
      }
    })
  }

  updateSwipeState = (swipeDirection, dragLen) => {
    this.setState({
      swipeDirection,
      dragLen
    })
  }

  componentWillUpdate = (nextProps) => {
    if (nextProps.flashcard.visibleAnswer !== this.props.flashcard.visibleAnswer) {
      this.animate()
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

    // const backStyle = this.props.flashcard.visibleAnswer ? {height: 200} : {};

    return (
      <Animatable.View onLayout={this.onLayout} animation='zoomInLeft'>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
          <View style={styles.flipCardContainer}>
            <TouchableWithoutFeedback onPress={() => this.flipCard()}>
              <View>
                <Card dynamicStyles={this.state.dynamicStyles}
                      question={this.props.question} answer={this.props.answer}
                      image={this.props.image}
                      visibleAnswer={this.props.flashcard.visibleAnswer}
                      isCasualFlashcard={this.props.isQuestionCasual}/>
                <View
                  style={{ width: '90%', alignItems: 'flex-end', marginLeft: 0, flexDirection: 'row', marginTop: -1 }}>
                  <View style={{
                    width: (this.state.windowDimensions.width * 0.9) - 200,
                    height: '100%',
                    backgroundColor: 'white'
                  }}><Text /></View>
                  <Image style={{ width:200, height:22.5 }} source={require('../images/pageCorner.png')}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      </Animatable.View>
    )
  }
}

export default (connect(state => state)(Flashcard))
