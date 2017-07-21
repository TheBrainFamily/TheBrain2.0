// @flow

import React from 'react'
import {View} from 'react-native'

import styles from '../styles/styles'

export default class ProgressBar extends React.Component {
  render() {
    const progressInPercent = this.props.progress * 100
    const progressInPercentText = `${progressInPercent}%`
    console.log('######EEEEEEXTRAAA PONTON######: progressInPercentText', progressInPercentText)

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack} />
        <View style={[styles.progressBarProgressLine, {width: progressInPercentText}]}/>
        <View style={[styles.progressBarProgressCircle, {left: progressInPercentText}]}/>
      </View>
    )
  }
}
