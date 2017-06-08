import React from 'react'
import { Text, View } from 'react-native'

import SwipeBall from './SwipeBall'

import styles from '../styles/styles'

class AnswerEvaluator extends React.Component {
  render () {
    return (
      <View style={styles.answerEvaluator}>
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
        {!this.props.enabled && <View style={styles.answerEvaluatorOverlay} />}
      </View>
    )
  }
}

export default AnswerEvaluator
