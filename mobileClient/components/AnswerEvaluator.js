import React from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'

import SwipeBall from './SwipeBall'
import LevelUpWrapper from './LevelUpWrapper'
import Tutorial from './Tutorial'
import CasualQuestionModal from './CasualQuestionModal'
import userDetailsQuery from '../shared/graphql/queries/userDetails'
import { updateAnswerVisibility } from '../actions/FlashcardActions'

import styles from '../styles/styles'

console.disableYellowBox = true

class AnswerEvaluator extends React.Component {
  overlayPress = () => {
    this.props.dispatch(updateAnswerVisibility(true))
  }

  render () {
    if (this.props.userDetails.loading) {
      return <View />
    }

    return (
      <Animatable.View style={[styles.answerEvaluator, {height: this.props.getAnswerEvaluatorHeight()}]} animation='slideInUp'>
        <LinearGradient
          style={styles.answerTopLine}
          colors={['#71b9d3', '#b3b3b3']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        />
        <LinearGradient
          style={styles.answerRightLine}
          colors={['#ff8533', '#b3b3b3']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
        />
        <LinearGradient
          style={styles.answerBottomLine}
          colors={['#c1272d', '#b3b3b3']}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
        />
        <LinearGradient
          style={styles.answerLeftLine}
          colors={['#62c46c', '#b3b3b3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        />
        <View style={styles.answerFieldTop}>
          <Text style={styles.answerText}>Easy</Text>
        </View>
        <View style={styles.answerFieldRight}>
          <Text style={[styles.answerText, { transform: [{ rotate: '90deg' }] }]}>Good</Text>
        </View>
        <View style={styles.answerFieldBottom}>
          <Text style={styles.answerText}>No clue</Text>
        </View>
        <View style={styles.answerFieldLeft}>
          <Text style={[styles.answerText, { transform: [{ rotate: '-90deg' }] }]}>Wrong</Text>
        </View>
        <View style={styles.answerCircle} />
        <SwipeBall evalItemId={this.props.evalItemId} />

        {!this.props.enabled && <TouchableWithoutFeedback onPress={this.overlayPress}>
          <View style={styles.answerEvaluatorOverlay}/></TouchableWithoutFeedback>}
        {this.props.enabled && <Tutorial/>}
        {!this.props.enabled && this.props.userDetails.UserDetails.isCasual === null && <CasualQuestionModal/>}
      </Animatable.View>
    )
  }
}

export default compose(
  connect(),
  graphql(userDetailsQuery, {
    name: 'userDetails'
  }),
  LevelUpWrapper
)(connect(state => state)(AnswerEvaluator))
