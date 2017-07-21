// @flow

import React from 'react'
import { Text, View } from 'react-native'
import styles from '../styles/styles'

export default class Card extends React.Component {
  render = () => {
    return (
      <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
        <View style={{ display: this.props.visibleAnswer ? 'none' : 'flex' }}>
          <Text
            style={[styles.flipCardHeader, { color: this.props.visibleAnswer ? 'white' : '#662d91' }]}>QUESTION</Text>
          <View style={styles.flipCardBody}>
            <Text style={styles.primaryText}>{this.props.question}</Text>
          </View>
        </View>
        <View style={{ transform: [{ rotateY: '180deg' }], display: this.props.visibleAnswer ? 'flex' : 'none' }}>
          <Text style={styles.flipCardHeader}>ANSWER</Text>
          <View style={styles.flipCardBody}>
            <Text style={styles.primaryText}>{this.props.answer}</Text>
          </View>
        </View>
      </View>
    )
  }
}
