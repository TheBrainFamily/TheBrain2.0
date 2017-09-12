import React from 'react'
import { Animated, Easing, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

export default class CircleButton extends React.Component {
  constructor (props) {
    super(props)
    const radius = props.withStaticCircles ? props.radius / 3 : 0
    this.state = {
      rotation: new Animated.Value(0),
      radius: new Animated.Value(radius)
    }
  }

  onPress = () => {
    if(this.props.isDisabled) {
      return
    }
    if (this.props.withStaticCircles) {
      return
    }
    if (!this.props.courseSelectorIsDisabled) {
      this.props.disableCourseSelector()
      this.state.rotation.setValue(0)
      this.state.radius.setValue(0)
      Animated.parallel([
        Animated.timing(this.state.rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1)
        }),
        Animated.timing(this.state.radius, {
          toValue: 20,
          duration: 1000
        })
      ]).start(this.props.onPress)
    }
  }

  getSize (radius) {
    return {
      width: radius,
      height: radius
    }
  }

  getTranslation (translateDiff) {
    return {
      transform: [{translateX: translateDiff}, {translateY: translateDiff}]
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

    const borderWidth = this.props.radius / 30
    const innerRadius = this.props.radius - borderWidth
    const maxSmallCircleRadius = this.props.radius / 3
    const halfOfSmallCircleRadius = maxSmallCircleRadius /2

    const animationCircleStyle = {
      position: 'absolute',
      width: innerRadius * 2 + maxSmallCircleRadius,
      height: innerRadius * 2 + maxSmallCircleRadius,
    }

    const componentOpacity = this.props.isDisabled ? 0.5 : 1

    return (
      <TouchableWithoutFeedback onPress={this.onPress} style={{opacity: componentOpacity}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{
            backgroundColor: this.props.color,
            margin: halfOfSmallCircleRadius ,
            width: this.props.radius * 2,
            height: this.props.radius * 2,
            borderRadius: this.props.radius,
            borderWidth,
            borderColor: 'white',
            opacity: componentOpacity
          }}>
            <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', opacity: componentOpacity}}>
              {this.props.children}
            </View>
          </View>
          <Animated.View style={[animationCircleStyle, {transform: [{rotate: rotation}]}]}>
            <Animated.View style={[
              style.smallCircle,
              this.getSize(this.state.radius),
              this.getTranslation(translateDiff),
              {left: innerRadius + halfOfSmallCircleRadius, top: halfOfSmallCircleRadius }
            ]}/>
            <Animated.View style={[
              style.smallCircle,
              this.getSize(this.state.radius),
              this.getTranslation(translateDiff),
              {left: innerRadius * 2 + halfOfSmallCircleRadius, top: innerRadius + halfOfSmallCircleRadius}
            ]}/>
            <Animated.View style={[
              style.smallCircle,
              this.getSize(this.state.radius),
              this.getTranslation(translateDiff),
              {left: innerRadius + halfOfSmallCircleRadius, top: innerRadius * 2 + halfOfSmallCircleRadius}
            ]}/>
            <Animated.View style={[
              style.smallCircle,
              this.getSize(this.state.radius),
              this.getTranslation(translateDiff),
              {
                left: halfOfSmallCircleRadius, top: innerRadius + halfOfSmallCircleRadius
              }]}/>
          </Animated.View>
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
    height: 116
  },
  smallCircle: {
    position: 'absolute',
    top: 0,
    left: 58,
    transform: [{translateX: -10}, {translateY: -10}],
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10
  }
})
