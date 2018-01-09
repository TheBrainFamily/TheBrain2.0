// @flow

import React from 'react'
import {
    Text,
    View
} from 'react-native'
import styles from '../styles/styles'
export default class extends React.Component {
  render () {
    const {newFlashcards, dueFlashcards, reviewFlashcards} = this.props

    return <View style={styles.summaryContainer}>
      <Text style={[styles.summaryRow, styles.summaryLeftRow]}>New: {newFlashcards.done} / {newFlashcards.total}</Text>
      <Text style={[styles.summaryRow, styles.summaryCenterRow]}>Due: {dueFlashcards.done} / {dueFlashcards.total} </Text>
      <Text style={[styles.summaryRow, styles.summaryRightRow]}>Review: {reviewFlashcards.done} / {reviewFlashcards.total}</Text>
    </View>
  }
}
