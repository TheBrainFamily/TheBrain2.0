// @flow

import React from 'react'
import {
  Text,
  View,
} from 'react-native'
import styles from '../styles/styles'

export default class Card extends React.Component {
  constructor (props: Object) {
    super(props)
  }

  render = () => {
    return (
      <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
        {!this.props.visibleAnswer ?
        <View>
          <Text style={styles.flipCardHeader}>QUESTION</Text>
          <View style={styles.flipCardBody}>
            <Text style={styles.primaryText}>{this.props.question}</Text>
          </View>
        </View>
          :
        <View style={{transform: [{rotateY: '180deg'}]}}>
          <Text style={styles.flipCardHeader}>ANSWER</Text>
          <View style={styles.flipCardBody}>
            <Text style={styles.primaryText}>{this.props.answer}</Text>
          </View>
        </View>
        }
      </View>
    )
  }
}
