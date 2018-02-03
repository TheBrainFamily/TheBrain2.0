import React from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { LinearGradient } from 'expo'
import * as Animatable from 'react-native-animatable'

import SwipeBall from './SwipeBall'
import Triangle from './Triangle'
import LevelUpWrapper from '../../../components/LevelUpWrapper'
import Tutorial from './Tutorial'
import CasualQuestionModal from './CasualQuestionModal'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import { updateAnswerVisibility } from '../../../actions/FlashcardActions'

import styles from '../../../styles/styles'
import WithData from '../../../components/WithData'

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
        <Triangle animated={this.props.enabled} line='top' style={styles.triangleTop} />
        <LinearGradient
          style={styles.answerTopLine}
          colors={['#71b9d3', '#b3b3b3']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        />
        <Triangle animated={this.props.enabled} line='right' style={styles.triangleRight} />
        <LinearGradient
          style={styles.answerRightLine}
          colors={['#62c46c', '#b3b3b3']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
        />
        <Triangle animated={this.props.enabled} line='bottom' style={styles.triangleBottom} />
        <LinearGradient
          style={styles.answerBottomLine}
          colors={['#c1272d', '#b3b3b3']}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
        />
        <Triangle animated={this.props.enabled} line='left' style={styles.triangleLeft} />
        <LinearGradient
          style={styles.answerLeftLine}
          colors={['#ff8533', '#b3b3b3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        />
        <View style={styles.answerFieldTop}>
          <Text style={styles.answerText}>Easy</Text>
        </View>
        <View style={styles.answerFieldRight}>
          <Text style={[styles.answerText, { transform: [{ rotate: '90deg' }] }]}>Correct</Text>
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
          <View style={styles.answerEvaluatorOverlay} /></TouchableWithoutFeedback>}
        {this.props.enabled && <Tutorial />}
        {!this.props.enabled && this.props.userDetails.UserDetails.isCasual === null && !this.props.isQuestionCasual && <CasualQuestionModal />}
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
)(connect(state => state)(WithData(AnswerEvaluator, ['userDetails'])))
