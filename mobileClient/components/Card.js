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
            style={styles.flipCardHeader}>{!this.props.visibleAnswer && 'QUESTION'}</Text>
          <View style={styles.flipCardBody}>
            <Text style={styles.primaryText}>{!this.props.visibleAnswer && this.props.question}</Text>
          </View>
        </View>
        <View style={{ transform: [{ rotateY: '180deg' }], display: !this.props.visibleAnswer ? 'none' : 'flex' }}>
          <Text style={styles.flipCardHeader}>ANSWER</Text>
          <View style={styles.flipCardBody}>
            <Text style={styles.primaryText}>{this.props.visibleAnswer && this.props.answer}</Text>
          </View>
        </View>
      </View>
    )
  }
}
