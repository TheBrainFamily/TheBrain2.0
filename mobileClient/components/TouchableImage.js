// @flow

import React from 'react';
import {
  Animated,
  Image,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animator from './Animator'

export default class TouchableImage extends React.Component {
  constructor(props: Object) {
    super(props)

    this.layoutStyle = {
      position: 'absolute',
      zIndex: 9999,
      width: '100%',
      height: '100%'
    }

    this.state = {
      animator: new Animator(this.props.animator)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ animator: new Animator(nextProps.animator)});
    this.state.animator.resetAnimations()
  }

  render = () => {
    return (
      <Animated.View style={[ this.layoutStyle, this.props.style, this.state.animator.getStyle() ]}>
        <TouchableWithoutFeedback onPress={() => { this.state.animator.startAnimations() }}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={{ uri: this.props.imageProperties.source }}
            resizeMode={ this.props.imageProperties.resizeMode }
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}
