import React from 'react'
import { connect } from 'react-redux'
import { Animated, PanResponder, View } from 'react-native'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router'
import _ from 'lodash'

import styles from '../styles/styles'
import { updateAnswerVisibility } from '../actions/FlashcardActions'
import { getSwipeDirection, getDragLength, getDirectionEvaluationValue } from '../helpers/SwipeHelpers'

import sessionCountQuery from '../shared/graphql/queries/sessionCount'
import userDetailsQuery from '../shared/graphql/queries/userDetails'
import submitEval from '../shared/graphql/mutations/processEvaluation'
import currentItemsQuery from '../shared/graphql/queries/itemsWithFlashcard'
import { mutationConnectionHandler } from './NoInternet'
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
  graphql(submitEval, {
    props: ({ ownProps, mutate }) => ({
      submit: ({ itemId, evaluation }) => mutate({
        variables: {
          itemId,
          evaluation
        },
        optimisticResponse: {
          processEvaluation: {
            // With this fake data we get warnings in the client on every evaluation :-(
            '_id': '-1',
            'flashcardId': '',
            'extraRepeatToday': false,
            'actualTimesRepeated': 0,
            '__typename': 'Item',
            'flashcard': {
              '_id': '-1',
              'question': '',
              'answer': '',
              'isCasual': true,
              'image': null,
              'answerImage': null,
              '__typename': 'Flashcard'
            },
            switchFlashcards: true
          }
        },
        update: (proxy, { data: { processEvaluation } }) => {
          const data = proxy.readQuery({ query: currentItemsQuery })
          if (processEvaluation.switchFlashcards) {
            const newFlashcards = [_.last(data.Items)]
            data.Items = newFlashcards
          } else {
            data.Items = processEvaluation
          }
          proxy.writeQuery({ query: currentItemsQuery, data })
        },
        refetchQueries: [{
          query: sessionCountQuery
        },
        {
          query: userDetailsQuery
        }]
      })
    })
  }),

  connect()
)(SwipeBall)
