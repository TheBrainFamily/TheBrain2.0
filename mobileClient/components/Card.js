// @flow

import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import TouchableImage from './TouchableImage'
import styles from '../styles/styles'

export default class Card extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      toolTipVisible: false
    }
  }

  componentWillReceiveProps = () => {
    this.setState({ toolTipVisible: false })
  }

  notCasualOnPress = () => {
    this.setState({ toolTipVisible: !this.state.toolTipVisible })
  }

  render = () => {

    const displayStyleQuestion = { display: this.props.visibleAnswer ? 'none' : 'flex', flex: this.props.image ? 0 : 1 }
    const displayStyleQuestionImage = { opacity: this.props.visibleAnswer ? 0 : 1 }
    const displayStyleAnswer = { display: this.props.visibleAnswer ? 'flex' : 'none', flex: 1 }

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
      bottom: {
        initial: 10,
        final: 0,
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

    const isNotCasualIndicator =
      !this.props.isCasualFlashcard && <TouchableOpacity onPress={this.notCasualOnPress}>
        {this.state.toolTipVisible ? <View>
          <Text style={{ marginTop: 5, marginRight: 5, color: 'black', fontSize: 12, fontFamily: 'Exo2-Bold' }}>This is a hard
            question</Text>
        </View>
          : <Image
            style={{ width: 21, height: 19, marginTop: 5, marginRight: 5 }}
            source={require('../../client/src/img/exclamation.png')}
          />}
      </TouchableOpacity>

    return (
      <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
        <View style={[displayStyleQuestion, { flex: 1 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text
              style={styles.flipCardHeader}>{!this.props.visibleAnswer && 'QUESTION'}
            </Text>
            { !this.props.visibleAnswer && isNotCasualIndicator }
          </View>
          <View style={[styles.flipCardBody, displayStyleQuestion]}>
            <Text
              style={[styles.cardText, questionFontSizeStyle]}>{!this.props.visibleAnswer && this.props.question}</Text>
          </View>
          {this.props.image ?
            <TouchableImage style={[styles.cardImage, displayStyleQuestionImage]}
                            animator={animationSettings}
                            imageProperties={{
              source: this.props.image.url,
              resizeMode: 'contain',
            }}
            /> : null}
        </View>
        <View style={[{ transform: [{ rotateY: '180deg' }] }, displayStyleAnswer]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text style={styles.flipCardHeader}>{this.props.visibleAnswer && 'ANSWER'}</Text>
            { this.props.visibleAnswer && isNotCasualIndicator }
          </View>
          <View style={[styles.flipCardBody, displayStyleAnswer]}>
            <Text style={styles.cardText}>{this.props.visibleAnswer && this.props.answer}</Text>
          </View>
        </View>
      </View>
    )
  }
}
