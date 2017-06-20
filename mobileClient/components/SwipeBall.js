import React from 'react'
import { connect } from 'react-redux'
import { Animated, PanResponder, View } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import LinearGradient from 'react-native-linear-gradient'

import styles from '../styles/styles'
import { updateAnswerVisibility } from '../actions/FlashcardActions'
import { getSwipeDirection, getDragLength, getDirectionEvaluationValue } from '../helpers/SwipeHelpers'

import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount'

const defaultBallColors = ['#7c45d2', '#672f92']
const alternativeBallColors = ['#62c46c', '#3f873f']

class SwipeBall extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      pan: new Animated.ValueXY(),
      ballColors: defaultBallColors
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        const delta = { dx: 0, dy: 0 }
        const isHorizontalMove = Math.abs(gesture.dx) > Math.abs(gesture.dy)
        if (isHorizontalMove) {
          delta.dx =  this.state.pan.x
        } else {
          delta.dy =  this.state.pan.y
        }
        Animated.event([null, delta])(e, gesture)
      },
      onPanResponderRelease: (e, gesture) => {
        const dragLen = getDragLength(gesture.dx, gesture.dy)
        if (dragLen > 40) {
          const isHorizontalMove = Math.abs(gesture.dx) > Math.abs(gesture.dy)
          const targetPosition = { x: 0, y: 0 }
          if (isHorizontalMove) {
            targetPosition.x = 140 * Math.sign(gesture.dx)
          } else {
            targetPosition.y = 110 * Math.sign(gesture.dy)
          }

          setTimeout(() => {
            this.setState({ ballColors: alternativeBallColors })
          }, 200)
          Animated.spring(this.state.pan, {
            toValue: targetPosition
          }).start(this.submitEvaluation)
        } else {
          this.resetPosition()
        }
      }
    })
  }

  resetPosition = (cb = () => {}) => {
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: 0 }
    }).start(cb)
  }

  submitEvaluation = () => {
    console.log('* LOG * submitEvaluation')
    // this.setState({ ballColors: alternativeBallColors })
    const direction = getSwipeDirection(this.state.pan.x._value, this.state.pan.y._value)
    const evaluationValue = getDirectionEvaluationValue(direction)
    this.onSubmitEvaluation(evaluationValue)
  }

  onSubmitEvaluation = (value) => {
    this.resetPosition(() => {
      this.props.submit({
        itemId: this.props.evalItemId,
        evaluation: value
      })
      this.props.dispatch(updateAnswerVisibility(false))
      this.setState({ ballColors: defaultBallColors })
    })
  }

  render () {
    return (
      <View style={styles.draggableContainer}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[ styles.answerSwipeBall, this.state.pan.getLayout() ]}
        >
          <LinearGradient
            style={styles.answerSwipeBall}
            colors={this.state.ballColors}
          />
        </Animated.View>
      </View>
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
                _id question answer
            }
        }
    }
`

export default graphql(submitEval, {
  props: ({ownProps, mutate}) => ({
    submit: ({itemId, evaluation}) => mutate({
      variables: {
        itemId,
        evaluation
      },
      updateQueries: {
        CurrentItems: (prev, {mutationResult}) => {
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
})(connect()(SwipeBall))
