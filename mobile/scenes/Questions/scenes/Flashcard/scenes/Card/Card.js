// @flow

import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import TouchableImage from './components/TouchableImage'
import styles from './styles'

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
    const displayStyleAnswer = { display: this.props.visibleAnswer ? 'flex' : 'none', flex: this.props.answerImage ? 0 : 1 }
    const displayStyleAnswerImage = { opacity: this.props.visibleAnswer ? 1 : 0 }

    const questionFontSizeStyle = { fontSize: this.props.image && this.props.dynamicStyles.content.height < 180 ? 12 : 16 }
    const answerFontSizeStyle = { fontSize: this.props.answerImage && this.props.dynamicStyles.content.height < 180 ? 12 : 16 }

    const isNotCasualIndicator =
      !this.props.isCasualFlashcard && <TouchableOpacity onPress={this.notCasualOnPress}>
        {this.state.toolTipVisible ? <View>
          <Text style={{ marginTop: 5, marginRight: 5, color: 'black', fontSize: 12 }}>This is a hard
            question</Text>
        </View>
          : <Image
            style={{ width: 21, height: 19, marginTop: 5, marginRight: 5 }}
            source={require('./images/exclamation.png')}
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
          {this.props.image
            ? <TouchableImage style={[styles.cardImage, displayStyleQuestionImage]}
              imageProperties={{
                source: this.props.image.url,
                resizeMode: 'contain'
              }}
            /> : null}
        </View>
        <View style={[{ transform: [{ rotateY: '180deg' }] }, displayStyleAnswer]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text style={styles.flipCardHeader}>{this.props.visibleAnswer && 'ANSWER'}</Text>
            { this.props.visibleAnswer && isNotCasualIndicator }
          </View>
          <View style={[styles.flipCardBody, displayStyleAnswer]}>
            <Text style={[styles.cardText, answerFontSizeStyle]}>{this.props.visibleAnswer && this.props.answer}</Text>
          </View>
          {this.props.answerImage
            ? <TouchableImage style={[styles.cardImage, displayStyleAnswerImage]}
              imageProperties={{
                source: this.props.answerImage.url,
                resizeMode: 'contain'
              }}
            /> : null}
        </View>
      </View>
    )
  }
}
