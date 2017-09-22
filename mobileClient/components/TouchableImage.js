// @flow

import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import NetworkImage from './NetworkImage'
import * as fullscreenActions from '../actions/FullscreenActions'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'

class TouchableImage extends React.Component {
  render = () => {
    return (
      <View style={this.props.style}>
        <TouchableWithoutFeedback onPress={() => {
          this.props.dispatch(fullscreenActions.setOverlay({
            visible: true,
            image: {
              src: this.props.imageProperties.source
            }
          }))
        }}>
          <NetworkImage
            style={{width: '100%', height: '100%'}}
            source={{uri: this.props.imageProperties.source}}
            resizeMode={ this.props.imageProperties.resizeMode }
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default compose(
  connect(state => state)
)(TouchableImage)
