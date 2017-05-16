// @flow

import React from 'react';
import {
  Animated,
  Image,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
import Animator from './Animator'
import styles from '../styles/styles';

export default class TouchableImage extends React.Component {
  imageProperties: {
    source: string,
    style: Object,
    display: boolean
  };

  constructor(props: Object) {
    super(props);
    this.imageProperties = {
      source: 'http://team.thebrain.pro/img/logo.png',
      style: {
        width: 100,
        height: 100,
      }
    }

    this.layoutStyle = {
      position: 'absolute',
      zIndex: 9999,
    }

    const { width, height } = Dimensions.get('window');

    this.state = {
      animator: new Animator({
        width: {
          initial: this.imageProperties.style.width,
          final: width,
        },
        height: {
          initial: this.imageProperties.style.height,
          final: this.getFlashcardContentHeight(height),
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
      })
    };
  }

  componentWillReceiveProps() {
    this.state.animator.resetAnimations();
  }

  //should be exported/imported, duplicate code
  getFlashcardContentHeight = (height) => {
    const heightOfOtherElements =
      StyleSheet.flatten(styles.topContainer).height +
      StyleSheet.flatten(styles.summaryContainer).height +
      2 * StyleSheet.flatten(styles.primaryHeader).height;
    return height - heightOfOtherElements;
  };

  onLayout = () => {
    const { width, height } = Dimensions.get('window');
    this.state.animator.updateFinalDimension('width', width);
    this.state.animator.updateFinalDimension('height', this.getFlashcardContentHeight(height));
  }

  render = () => {
    return (
      <View onLayout={this.onLayout} style={[this.layoutStyle, {width: '100%', height: '100%'}]}>
        <Animated.View style=
                         { [
                           this.layoutStyle,
                           { backgroundColor: 'transparent', shadowColor: 'black', shadowOffset: {width: 4, height: 4} },
                           this.state.animator.getStyle()]
                         }>
          <TouchableWithoutFeedback onPress={() => { this.state.animator.startAnimations(true) }}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: this.imageProperties.source}}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    )
  }
}
