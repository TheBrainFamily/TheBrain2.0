import React, { PropTypes } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback, Animated } from 'react-native'

import appStyle from '../styles/appStyle'
import NetworkImage from './NetworkImage'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'

import Orientation from 'react-native-orientation'
import * as fullscreenActions from '../actions/FullscreenActions'

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%'
  },
  fullscreen: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    position: 'absolute',
    elevation: 9999,
  }
})

class FullscreenOverlay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fadeValue: new Animated.Value(0)
    }
  }

  startFadeIn = () => {
    Orientation.unlockAllOrientations()
    Animated.timing(
      this.state.fadeValue, {
        toValue: 1,
        duration: 250
      }).start();
  }

  startFadeOut = (cb) => {
    Orientation.lockToPortrait()
    Animated.timing(
      this.state.fadeValue, {
        toValue: 0,
        duration: 250
      }).start(cb);
  }

  changeVisibility = () => {
    this.startFadeOut(() => {
      this.props.dispatch(fullscreenActions.setOverlay({visible: false}))
    })
  }

  componentWillUpdate = (nextProps) => {
    if(nextProps.fullscreen.visible) {
      this.startFadeIn()
    }
  }

  render() {
    if(!this.props.fullscreen.visible) {
      return null
    }
    if(!this.props.fullscreen.image) {
      return
    }
    return (
      <TouchableWithoutFeedback onPress={() => {this.changeVisibility()}}>
        <Animated.View style={[styles.fullscreen, { opacity: this.state.fadeValue }]}>
          <NetworkImage
            style={{width: '100%', height: '90%'}}
            source={{uri: this.props.fullscreen.image.src }}
            resizeMode={ 'contain' }
          />
          <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Click anywhere to hide</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const FullscreenOverlayWithState = compose(
  connect(state => state)
)(FullscreenOverlay)

const Page = props => (
  <View
    style={[styles.page, {
      backgroundColor: props.backgroundColor || appStyle.colors.bg
    }]}
  >
    {props.children}
    <FullscreenOverlayWithState/>
  </View>
)

Page.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string
}

Page.defaultProps = {
  backgroundColor: 'transparent'
}

export default Page
