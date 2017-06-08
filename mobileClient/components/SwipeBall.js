import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import LinearGradient from 'react-native-linear-gradient'

import styles from '../styles/styles'
import { updateAnswerVisibility } from '../actions/FlashcardActions'
import { getSwipeDirection, getDragLength, getDirectionEvaluationValue } from '../helpers/SwipeHelpers'

import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount'

class SwipeBall extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: {
        x: 0,
        y: 0
      }
    }
  }

  onSubmitEvaluation = (value) => {
    this.props.submit({
      itemId: this.props.evalItemId,
      evaluation: value
    })
    this.props.dispatch(updateAnswerVisibility(false))
    // this.props.flipCardCb()
  }

  isDragLongEnough = () => {
    const dragLen = getDragLength(this.state.position.x, this.state.position.y)
    return dragLen > 100
  }

  resetPosition = (e) => {
    const direction = getSwipeDirection(this.state.position.x, this.state.position.y)
    if (this.isDragLongEnough()) {
      const evaluationValue = getDirectionEvaluationValue(direction)
      this.onSubmitEvaluation(evaluationValue)
    }
    // Reset on release
    this.setState({ position: { x: 0, y: 0 } })
    // const baseSwipeValue = 'left'
    // const baseDrag = 0
    // this.props.updateSwipeStateCb(baseSwipeValue, baseDrag)
  }

  setupInitialDrag = (e) => {
    this.drag = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY
    }
  }

  setPosition = (event) => {
    // Update our state with the deltaX/deltaY of the movement
    const x = this.state.position.x + (event.nativeEvent.pageX - this.drag.x)
    const y = this.state.position.y + (event.nativeEvent.pageY - this.drag.y)
    this.setState({ position: { x, y } })
    // const dragLen = getDragLength(this.state.position.x, this.state.position.y)
    // const swipeDirection = getSwipeDirection(this.state.position.x, this.state.position.y)
    // this.props.updateSwipeStateCb(swipeDirection, dragLen)

    // Set our drag to be the new position so our delta can be calculated next time correctly
    this.drag.x = event.nativeEvent.pageX
    this.drag.y = event.nativeEvent.pageY
  }

  getCardTransformation = function () {
    const transform = [{ translateX: this.state.position.x }, { translateY: this.state.position.y - 35 }]
    return { transform }
  }

  render () {
    return (
      <LinearGradient
        colors={['#7c45d2', '#672f92']}
        style={[ styles.answerSwipeBall, this.getCardTransformation() ]}
        onResponderMove={this.setPosition}
        onResponderRelease={this.resetPosition}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={this.setupInitialDrag}
      />
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
