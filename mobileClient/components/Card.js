// @flow

import React from 'react'
import { Text, View } from 'react-native'
import TouchableImage from './TouchableImage'
import styles from '../styles/styles'

export default class Card extends React.Component {
  render = () => {

    const displayStyleQuestion = { display: this.props.visibleAnswer ? 'none' : 'flex' }
    const displayStyleQuestionImage = { opacity: this.props.visibleAnswer ? 0 : 1 }
    const displayStyleAnswer = { display: this.props.visibleAnswer ? 'flex' : 'none' }

    console.log('PINGWIN: this.props.dynamicStyles.content.height', this.props.dynamicStyles.content.height)
    const imageThumbnailSize = this.props.dynamicStyles.content.height < 180 ? 50 : 100
    const questionFontSizeStyle = { fontSize: this.props.image && this.props.dynamicStyles.content.height < 180 ? 12 : 16 }

    const animationSettings = {
      width: {
        initial: imageThumbnailSize,
        final: this.props.dynamicStyles.content.width,
        friction: 7,
      },
      height: {
        initial: imageThumbnailSize,
        final: this.props.dynamicStyles.content.height,
        friction: 7,
      },
      top: {
        initial: 0,
        // final: this.props.dynamicStyles.content.height * 0.136,
        final: -(this.props.dynamicStyles.content.height - imageThumbnailSize)/ 2,
        // final: 0,
        friction: 7,
      },
      shadowRadius: {
        initial: 4,
        final: 0,
        friction: 7,
      },
      shadowOpacity: {
        initial: 0.5,
        final: 1,
        friction: 7,
      },
      borderRadius: {
        initial: 5,
        final: 0,
        friction: 7,
      },
      borderWidth: {
        initial: 1,
        final: 0,
        friction: 7,
      },
      marginVertical: {
        initial: 0,
        final: 1000,
        friction: 7,
      }
    }

    return (
      <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
        <View style={displayStyleQuestion}>
          <Text
            style={styles.flipCardHeader}>{!this.props.visibleAnswer && 'QUESTION'}</Text>
          <View style={[styles.flipCardBody, displayStyleQuestion]}>
            <Text
              style={[styles.cardText, questionFontSizeStyle]}>{!this.props.visibleAnswer && this.props.question}</Text>
            {this.props.image ? <TouchableImage imageProperties={{
              source: this.props.image.url,
              resizeMode: 'contain',
            }}
                                                style={[styles.cardImage, displayStyleQuestionImage]}
                                                animator={animationSettings}
            /> : null}
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
