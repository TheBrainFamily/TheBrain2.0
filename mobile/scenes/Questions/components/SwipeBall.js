import React from 'react'
import { connect } from 'react-redux'
import { Animated, PanResponder, View } from 'react-native'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router'

import { getGraphqlForProcessEvaluationMutation } from 'thebrain-shared/graphql/items/processEvaluation'
import styles from '../../../styles/styles'
import { updateAnswerVisibility } from '../../../actions/FlashcardActions'
import { getSwipeDirection, getDragLength, getDirectionEvaluationValue } from '../helpers/SwipeHelpers'
import { mutationConnectionHandler } from '../../../components/NoInternet'
import { LinearGradient } from 'expo'

const defaultBallColors = ['#7c45d2', '#672f92']
const ballColors = {
  top: ['#71b9d3', '#5a9ab4'],
  left: ['#ff8533', '#e17132'],
  bottom: ['#c1272d', '#972326'],
  right: ['#62c46c', '#3f873f']
}

class SwipeBall extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pan: new Animated.ValueXY(),
      ballColors: defaultBallColors,
      isEvaluated: false
    }

    const evaluateDragDirection = (gesture) => {
      const dragLen = getDragLength(gesture.dx, gesture.dy)
      if (dragLen > 60) {
        const isHorizontalMove = Math.abs(gesture.dx) > Math.abs(gesture.dy)
        const targetPosition = { x: 0, y: 0 }
        if (isHorizontalMove) {
          if (dragLen < 80) {
            return null
          }
          targetPosition.x = 140 * Math.sign(gesture.dx)
        } else {
          targetPosition.y = 110 * Math.sign(gesture.dy)
        }

        return { targetPosition, dragDirection: getSwipeDirection(this.state.pan.x._value, this.state.pan.y._value) }
      }
      return null
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        if (this.state.isEvaluated) return

        const delta = { dx: 0, dy: 0 }
        delta.dx = this.state.pan.x
        delta.dy = this.state.pan.y
        Animated.event([null, delta])(e, gesture)

        const dragData = evaluateDragDirection(gesture)
        if (dragData) {
          const { dragDirection } = dragData
          this.setState({ ballColors: ballColors[dragDirection] })
        } else {
          this.setState({ ballColors: defaultBallColors })
        }
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.state.isEvaluated) return

        const dragData = evaluateDragDirection(gesture)
        if (dragData) {
          const { targetPosition, dragDirection } = dragData
          this.setState({ ballColors: ballColors[dragDirection], isEvaluated: true })

          Animated.spring(this.state.pan, {
            toValue: targetPosition,
            speed: 30
          }).start(this.submitEvaluation)
        } else {
          this.resetPosition()
        }
      }
    })
  }

  resetPosition = (cb = () => {}) => {
    cb()
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: 0 },
      speed: 30
    }).start()
  }

  submitEvaluation = () => {
    const direction = getSwipeDirection(this.state.pan.x._value, this.state.pan.y._value)
    const evaluationValue = getDirectionEvaluationValue(direction)
    this.onSubmitEvaluation(evaluationValue)
  }

  onSubmitEvaluation = (value) => {
    this.resetPosition(() => {
      mutationConnectionHandler(this.props.history, async () => {
        this.props.submit({
          itemId: this.props.evalItemId,
          evaluation: value
        })
        this.props.dispatch(updateAnswerVisibility(false))
        this.setState({ ballColors: defaultBallColors, isEvaluated: false })
      })
    })
  }

  render () {
    return (
      <View style={styles.draggableContainer}>
        <Animated.View
          testID='swipe-ball'
          {...this.panResponder.panHandlers}
          style={[styles.answerSwipeBall, this.state.pan.getLayout()]}
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

export default compose(
  withRouter,
  getGraphqlForProcessEvaluationMutation(graphql),
  connect()
)(SwipeBall)
