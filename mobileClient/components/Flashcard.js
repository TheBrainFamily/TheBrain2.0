// @flow

import React from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import SvgUri from 'react-native-svg-uri'
import * as Animatable from 'react-native-animatable'

import Card from './Card'
import type { Direction } from '../helpers/SwipeHelpers'
import { DIRECTIONS } from '../helpers/SwipeHelpers'
import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount'

import {
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
  View,
  Text
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
        content: { height: this.props.getFlashcardHeight() }
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
        content: { height: this.props.getFlashcardHeight() }
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
        content: { height: this.props.getFlashcardHeight() }
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
                      visibleAnswer={this.props.flashcard.visibleAnswer}/>
                <View
                  style={{ width: '90%', alignItems: 'flex-end', marginLeft: 0, flexDirection: 'row', marginTop: -1 }}>
                  <View style={{
                    width: (this.state.windowDimensions.width * 0.9) - 200,
                    height: '100%',
                    backgroundColor: 'white'
                  }}><Text /></View>
                  <SvgUri width='200' height='22.5' source={require('../images/pageCorner.svg')}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      </Animatable.View>
    )
  }
}

const submitEval = gql`
    mutation processEvaluation($itemId: String!, $evaluation: Int!){
        processEvaluation(itemId:$itemId, evaluation: $evaluation){
            item {
                _id
                flashcardId
                extraRepeatToday
                actualTimesRepeated
            }
            flashcard
            {
                _id question answer image {
                    url hasAlpha
                }
            }
        }
    }
`

export default graphql(submitEval, {
  props: ({ ownProps, mutate }) => ({
    submit: ({ itemId, evaluation }) => mutate({
      variables: {
        itemId,
        evaluation
      },
      updateQueries: {
        CurrentItems: (prev, { mutationResult }) => {
          const updateResults = update(prev, {
            ItemsWithFlashcard: {
              $set: mutationResult.data.processEvaluation
            }
          })
          return updateResults
        }
      },
      refetchQueries: [{
        query: sessionCountQuery
      }]
    })
  })
})(connect(state => state)(Flashcard))

// <BackCard dynamicStyles={this.state.dynamicStyles}
// interpolateCb={this.interpolateWrapper}
// flipCardCb={this.flipCard}
// submitCb={this.props.submit}
// updateSwipeStateCb={this.updateSwipeState}
// answer={this.props.answer}
// evalItemId={this.props.evalItemId}
// />
