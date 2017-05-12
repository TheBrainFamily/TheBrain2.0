// @flow

import React from 'react';
import {
  Image,
  Text,
  View,
} from 'react-native';
import styles from '../styles/styles';

export default class TouchableImage extends React.Component {
  imageProperties: {
    source: string,
    style: Object
  };

  constructor(props: Object) {
    super(props);
    this.imageProperties = {
      source: 'http://team.thebrain.pro/img/logo.png',
      style: { width: '50%', height: '50%' }
    }
  }

  changeImageSize = () => {
    if (this.props.clickable) {
      console.log('image pressed', this.props);
    }
  }

  render = () => {
    return (
      <Image
        onPress={this.changeImageSize()}
        style={this.imageProperties.style}
        source={{uri: this.imageProperties.source}}
      />
    )
  }
}
