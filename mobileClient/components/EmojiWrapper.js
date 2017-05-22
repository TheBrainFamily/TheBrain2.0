// @flow

import React from 'react'
import {
    Text
} from 'react-native'
import Emoji from 'react-native-emoji'
import styles from '../styles/styles'
import type { Direction } from '../helpers/SwipeHelpers'

export default class EmojiWrapper extends React.Component {
  directionSettings: Object;
  direction: {
        emojiDescription: string,
        emoji: string,
        emojiStyle: Object,
        padding: number,
    };
  markerWidth: number;
  markerHeight: number;

  constructor (props: Object) {
    super(props)
    this.direction = {
      emojiDescription: '',
      emoji: '',
      emojiStyle: {},
      padding: 0
    }
    this.directionSettings = {
      right: {
        emojiDescription: 'Good',
        emoji: 'slightly_smiling_face',
        emojiStyle: styles.rightMarker,
        padding: -20
      },
      left: {
        emojiDescription: 'Wrong',
        emoji: 'sweat',
        emojiStyle: styles.leftMarker,
        padding: -15
      },
      top: {
        emojiDescription: 'Easy!',
        emoji: 'sunglasses',
        emojiStyle: styles.upMarker,
        padding: -5
      },
      bottom: {
        emojiDescription: 'No clue',
        emoji: 'scream',
        emojiStyle: styles.downMarker,
        padding: 90
      }
    }
  }

  getMarkerStyleForVertical = (directionName: Direction, markerStyle: Object, padding: number, dragFactor: number) => {
    const leftPadding = 35
    const widthCenter = (this.props.windowDimensions.width / 2) - this.markerWidth + leftPadding
    return {
      ...markerStyle,
      [directionName]: ((this.markerHeight / 2) * dragFactor) + padding,
      left: widthCenter
    }
  };

  getMarkerStyleForHorizontal = (directionName: Direction, markerStyle: Object, padding: number, dragFactor: number) => {
    const topPadding = -30
    const heightCenter = (this.props.windowDimensions.height / 2) - this.markerHeight + topPadding
    return {
      ...markerStyle,
      [directionName]: ((this.markerWidth / 2) * dragFactor) + padding,
      top: heightCenter
    }
  };

  getMarkerStyle = () => {
    const directionName = this.props.swipeDirection
    const dragFactor = this.props.dragLen / 100

    let markerStyle = {
      opacity: dragFactor * 2, transform: [{scale: dragFactor}]
    }

    this.direction = this.directionSettings[directionName]
    if (directionName === 'left' || directionName === 'right') {
      return this.getMarkerStyleForHorizontal(directionName, markerStyle, this.directionSettings[directionName].padding, dragFactor)
    }
    return this.getMarkerStyleForVertical(directionName, markerStyle, this.directionSettings[directionName].padding, dragFactor)
  };

  measureMarker = (event: Object) => {
    this.markerWidth = event.nativeEvent.layout.width
    this.markerHeight = event.nativeEvent.layout.height
  };

  render = () => {
    return (
      <Text style={[styles.baseMarkerStyle, this.direction.emojiStyle, this.getMarkerStyle()]}
        onLayout={(event) => this.measureMarker(event)}>
        <Emoji name={this.direction.emoji} />{this.direction.emojiDescription}
      </Text>
    )
  }
}
