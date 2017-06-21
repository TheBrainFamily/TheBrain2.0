import React from 'react'
import { Animated, Easing, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

export default class CircleButton extends React.Component {
  constructor (props) {
    super(props)
    const radius = props.withStaticCircles ? 12 : 0
    this.state = {
      rotation: new Animated.Value(0),
      radius: new Animated.Value(radius)
    }
  }

  onPress = () => {
    if (this.props.withStaticCircles) {
      return
    }
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

  getSize (radius) {
    return {
      width: radius,
      height: radius,
    }
  }

  getTranslation(translateDiff) {
    return {
      transform: [{ translateX: translateDiff }, { translateY: translateDiff }],
    }
  }

  render () {
    const rotation = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-90deg']
    })

    const translateDiff = this.state.radius.interpolate({
      inputRange: [0, 20],
      outputRange: [0, -10]
    })

    const innerRadius = this.props.radius - 2

    const animationCircleStyle = {
      width: innerRadius * 2,
      height: innerRadius * 2,
    }

    return (
      <TouchableWithoutFeedback onPress={this.onPress} style={{ marginTop: 20 }}>
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
            <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center' }}>
              {this.props.children}
            </View>
            <Animated.View style={[animationCircleStyle, { transform: [{ rotate: rotation }] }]}>
              <Animated.View style={[
                style.smallCircle,
                this.getSize(this.state.radius),
                this.getTranslation(translateDiff),
                { left: innerRadius }
              ]} />
              <Animated.View style={[
                style.smallCircle,
                this.getSize(this.state.radius),
                this.getTranslation(translateDiff),
                { left: innerRadius * 2, top: innerRadius }
              ]} />
              <Animated.View style={[
                style.smallCircle,
                this.getSize(this.state.radius),
                this.getTranslation(translateDiff),
                { left: innerRadius, top: innerRadius * 2 }
              ]} />
              <Animated.View style={[
                style.smallCircle,
                this.getSize(this.state.radius),
                this.getTranslation(translateDiff),
                { left: 0, top: innerRadius
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
