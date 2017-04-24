// @flow

import React from 'react';
import {
  Text,
  View,
  Animated,
} from 'react-native';
import styles from '../styles/styles';

export default class FrontCard extends React.Component {
  frontInterpolate: Object;
  constructor(props: Object) {
    super(props);
    this.frontInterpolate = props.interpolateCb({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
  }

  render = () => {
    const frontAnimatedStyle = {
      transform: [
        {rotateY: this.frontInterpolate}
      ]
    };

    return (
      <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
        <Text style={styles.primaryHeader}>QUESTION:</Text>
        <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
          <Text style={styles.primaryText}>{this.props.question}</Text>
        </View>
        <Text style={styles.primaryHeader}>SHOW ANSWER</Text>
      </Animated.View>
    )
  }
}
