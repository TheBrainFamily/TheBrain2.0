// @flow

import React from 'react'
import { Text, View } from 'react-native'
import styles from '../styles/styles'

export default class Card extends React.Component {
  render = () => {

    const displayStyleQuestion = { display: this.props.visibleAnswer ? 'none' : 'flex' }
    const displayStyleAnswer = { display: this.props.visibleAnswer ? 'flex' : 'none' }

    return (
      <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
        <View style={displayStyleQuestion}>
          <Text
            style={styles.flipCardHeader}>{!this.props.visibleAnswer && 'QUESTION'}</Text>
          <View style={[styles.flipCardBody, displayStyleQuestion]}>
            <Text style={styles.cardText}>{!this.props.visibleAnswer && this.props.question}</Text>
          </View>
        </View>
        <View style={[{ transform: [{ rotateY: '180deg' }] }, displayStyleAnswer]}>
          <Text style={styles.flipCardHeader}>{this.props.visibleAnswer && 'ANSWER'}</Text>
          <View style={[styles.flipCardBody, displayStyleAnswer]}>
            <Text style={styles.cardText}>{this.props.visibleAnswer && this.props.answer}</Text>
          </View>
        </View>
      </View>
    )
  }
}
