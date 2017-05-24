// @flow

import React from 'react'
import {
  Text,
  View,
} from 'react-native'
import styles from '../styles/styles'

export default class FrontCard extends React.Component {
  constructor (props: Object) {
    super(props)
  }

  render = () => {
    return (
      <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
        {!this.props.visibleAnswer ? <View>
          <Text style={styles.primaryHeader}>QUESTION:</Text>
          <Text style={styles.primaryText}>{this.props.question}</Text>
        </View> : <View style={{transform: [{rotateY: '180deg'}]}}>
          <Text style={styles.primaryHeader}>CORRECT ANSWER:</Text>
          <Text style={styles.primaryText}>{this.props.answer}</Text>
        </View>
        }
      </View>
    )
  }
}
