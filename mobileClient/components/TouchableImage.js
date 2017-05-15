// @flow

import React from 'react';
import {
  Animated,
  Image,
  TouchableWithoutFeedback,
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
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
      enlarged: false,
      heightAnimation: new Animated.Value(),
      widthAnimation: new Animated.Value(),
      flashcardHeight: this.getFlashcardContentHeight(height),
      flashcardWidth: width,
    };
  }

  componentWillReceiveProps() {
    this.setState({ enlarged: false });
    this.state.heightAnimation.setValue(this.imageProperties.style.height);
    this.state.widthAnimation.setValue(this.imageProperties.style.width);
  }

  changeImageSize = (event) => {

    let initialHeightValue, finalHeightValue, initialWidthValue, finalWidthValue;

    if (!this.state.enlarged) {
      this.setState({ enlarged: true });
      initialHeightValue = this.imageProperties.style.height;
      initialWidthValue = this.imageProperties.style.width;
      finalHeightValue = this.state.flashcardHeight;
      finalWidthValue = this.state.flashcardWidth;
    } else {
      this.setState({ enlarged: false });
      initialHeightValue = this.state.flashcardHeight;
      initialWidthValue = this.state.flashcardWidth;
      finalHeightValue = this.imageProperties.style.height;
      finalWidthValue = this.imageProperties.style.width;
    }

    this.state.heightAnimation.setValue(initialHeightValue);
    this.state.widthAnimation.setValue(initialWidthValue);

    Animated.parallel([
      Animated.spring(
        this.state.heightAnimation,
        {
          toValue: finalHeightValue
        }
      ),
      Animated.spring(
        this.state.widthAnimation,
        {
          toValue: finalWidthValue
        }
      ),
      ]
    ).start();
  }

  getFlashcardContentHeight = (height) => {
    const heightOfOtherElements =
      StyleSheet.flatten(styles.topContainer).height +
      StyleSheet.flatten(styles.summaryContainer).height +
      2 * StyleSheet.flatten(styles.primaryHeader).height;
    return height - heightOfOtherElements;
  };

  onLayout = () => {
    const { width, height } = Dimensions.get('window');
    this.setState({
      flashcardHeight: this.getFlashcardContentHeight(height),
      flashcardWidth: width,
    });
    this.state.heightAnimation.setValue(this.imageProperties.style.height);
    this.state.widthAnimation.setValue(this.imageProperties.style.width);
  }

  render = () => {
    return (
      <View onLayout={this.onLayout}
            style={[this.layoutStyle, {width: '100%', height: '100%'}]}
            >
        <Animated.View style={ [this.layoutStyle, { right: 0, width: this.state.widthAnimation, height: this.state.heightAnimation}] }>
          <TouchableWithoutFeedback onPress={this.changeImageSize}>
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
