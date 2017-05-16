// @flow

import React from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Dimensions
} from 'react-native';
import TouchableImage from './TouchableImage'
import styles from '../styles/styles';

export default class FrontCard extends React.Component {
  frontInterpolate: number;
  constructor(props: Object) {
    super(props);
    this.frontInterpolate = props.interpolateCb({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    const { width, height } = Dimensions.get('window');
    this.state = {
      width,
      height
    }
  }

  onLayout = () => {
    const { width, height } = Dimensions.get('window');
    this.setState({
      width,
      height
    });
    //this.state.animator.updateFinalDimension('width', width);
    //this.state.animator.updateFinalDimension('height', this.getFlashcardContentHeight(height));
    console.log('onLayout', this.state.width, this.state.height);
  }

  //should be exported/imported, duplicate code
  getFlashcardContentHeight = (height) => {
    const heightOfOtherElements =
      StyleSheet.flatten(styles.topContainer).height +
      StyleSheet.flatten(styles.summaryContainer).height +
      2 * StyleSheet.flatten(styles.primaryHeader).height;
    return height - heightOfOtherElements;
  };

  render = () => {
    const frontAnimatedStyle = {
      transform: [
        {rotateY: this.frontInterpolate}
      ]
    };

    return (
      <Animated.View style={[styles.flipCard, frontAnimatedStyle]} onLayout={this.onLayout} >
        <Text style={styles.primaryHeader}>QUESTION:</Text>
        <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
          <Text style={styles.primaryText}>{this.props.question}</Text>
          <TouchableImage imageProperties={{
                            source: 'http://team.thebrain.pro/img/logo.png',
                            resizeMode: 'contain'
                          }}
                          style={{
                            top: 30,
                            right: 30,
                            width: 100,
                            height: 100,
                            backgroundColor: 'transparent',
                            shadowColor: 'black',
                            shadowOffset: { width: 4, height: 4 },
                            shadowRadius: 4,
                            shadowOpacity: 0.5
                          }}
                          animator={{
                            width: {
                              initial: 100,
                              final: this.state.width,
                            },
                            height: {
                              initial: 100,
                              final: this.getFlashcardContentHeight(this.state.height),
                            },
                            right: {
                              initial: 30,
                              final: 0
                            },
                            top: {
                              initial: 30,
                              final: 0
                            },
                            shadowRadius: {
                              initial: 4,
                              final: 10
                            },
                            shadowOpacity: {
                              initial: 0.5,
                              final: 1
                            }
                          }}
          />
        </View>
        <Text style={styles.primaryHeader}>SHOW ANSWER</Text>
      </Animated.View>
    )
  }
}
