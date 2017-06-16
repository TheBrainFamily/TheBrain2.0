import React from 'react'
import { Animated, Easing, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

export default class CircleButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rotation: new Animated.Value(0),
      radius: new Animated.Value(0)
    }
  }

  onPress = () => {
    this.state.rotation.setValue(0)
    this.state.radius.setValue(0)

    Animated.parallel([
      Animated.timing(this.state.rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.elastic(1)
      }),
      Animated.timing(this.state.radius, {
        toValue: 20,
        duration: 2000
      })
    ]).start(this.props.onPress)
  }

  getSmallCircleDynamicStyle (radius) {
    return {
      width: radius,
      height: radius,
      transform: [{ translateX: -10 }, { translateY: -10 }],
    }
  }

  render () {
    const rotation = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-90deg']
    })

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View>
          <View style={{
            position: 'relative',
            backgroundColor: this.props.color,
            width: this.props.radius * 2,
            height: this.props.radius * 2,
            borderRadius: this.props.radius,
            borderWidth: 2,
            borderColor: 'white'
          }}>
            <Animated.View style={[style.animationCircle, { transform: [{ rotate: rotation }] }]}>
              <Animated.View style={[style.smallCircle, this.getSmallCircleDynamicStyle(this.state.radius)]} />
              <Animated.View style={[style.smallCircle, this.getSmallCircleDynamicStyle(this.state.radius), {
                left: 116,
                top: 58
              }]} />
              <Animated.View style={[style.smallCircle, this.getSmallCircleDynamicStyle(this.state.radius), { top: 116 }]} />
              <Animated.View style={[style.smallCircle, this.getSmallCircleDynamicStyle(this.state.radius), {
                left: 0,
                top: 58
              }]} />
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

CircleButton.defaultProps = {
  color: 'transparent',
  radius: 60,
  onPress: () => {}
}

const style = StyleSheet.create({
  animationCircle: {
    width: 116,
    height: 116,
  },
  smallCircle: {
    position: 'absolute',
    top: 0,
    left: 58,
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10
  }
})
