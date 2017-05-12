// @flow

import React from 'react';
import {
  Image,
  TouchableWithoutFeedback,
  View,
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
      style: {}
    }
    this.state = {
      imageSizeStyle:
        {
          width: '20%',
          height: '20%'
        },
      enlarged: false
    };

  }

  componentWillReceiveProps() {
    this.setState({ imageSizeStyle: { width: '20%', height: '20%' }, enlarged: false });
  }

  changeImageSize = (event) => {
    if (!this.state.enlarged) {
      this.setState({ imageSizeStyle: { width: '50%', height: '50%' }, enlarged: true });
    } else {
      this.setState({ imageSizeStyle: { width: '20%', height: '20%' }, enlarged: false });
    }
  }

  render = () => {
    return (
      <TouchableWithoutFeedback onPress={this.changeImageSize}>
          <Image
          style={[this.imageProperties.style, this.state.imageSizeStyle]}
          source={{uri: this.imageProperties.source}}
          resizeMode="contain"
        />
      </TouchableWithoutFeedback>
    )
  }
}
