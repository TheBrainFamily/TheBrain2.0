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
        <Text style={[styles.primaryText, styles.flipCardContent]}>{this.props.question}</Text>
        <Text style={styles.primaryHeader}>SHOW ANSWER</Text>
      </Animated.View>
    )
  }
}
