// @flow

import React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Animator from './Animator'
import NetworkImage from './NetworkImage'

export default class TouchableImage extends React.Component {
  state: Object

  constructor(props: Object) {
    super(props)

    this.state = {
      animator: new Animator(this.props.animator)
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    this.setState({animator: new Animator(nextProps.animator)})
    this.state.animator.resetAnimations()
  }

  render = () => {
    return (
      <Animated.View style={[this.props.style, this.state.animator.getStyle()]}>
        <TouchableWithoutFeedback onPress={() => {
          this.state.animator.startAnimations()
        }}>
          <NetworkImage
            style={{width: '100%', height: '100%'}}
            source={{uri: this.props.imageProperties.source}}
            resizeMode={ this.props.imageProperties.resizeMode }
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}
