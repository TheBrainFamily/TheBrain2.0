import React, { Component } from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'

class Hamburger extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: this.props.mainMenu.visible
    }
  }

  spinCross () {
    if (!this.state.active) {
      Animated.spring(this.containerAnim, {
        toValue: 1
      }).start()
      Animated.spring(this.topBar, {
        toValue: 0.9
      }).start()
      Animated.spring(this.bottomBar, {
        toValue: 0.9
      }).start()
      Animated.spring(this.bottomBarMargin, {
        toValue: -10
      }).start()
      Animated.spring(this.middleBarOpacity, {
        toValue: 0,
        duration: 30
      }).start()
      this.setState({
        active: true
      })
    } else {
      Animated.spring(this.containerAnim, {
        toValue: 0
      }).start()
      Animated.spring(this.topBar, {
        toValue: 0
      }).start()
      Animated.spring(this.bottomBar, {
        toValue: 0
      }).start()
      Animated.spring(this.bottomBarMargin, {
        toValue: 4
      }).start()
      Animated.timing(this.middleBarOpacity, {
        toValue: 1,
        duration: 600
      }).start()
      this.setState({
        active: false
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.active !== nextProps.mainMenu.visible) {
      this._animate()
    }
  }

  _animate () {
    this.spinCross()
  }

  componentDidMount () {
    this.setState({
      active: this.props.mainMenu.visible
    })
  }
  render () {
    const { color } = this.props

    if (this.state.active) {
      this.containerAnim = this.containerAnim || new Animated.Value(1)
      this.topBar = this.topBar || new Animated.Value(0.9)
      this.bottomBar = this.bottomBar || new Animated.Value(0.9)
      this.bottomBarMargin = this.bottomBarMargin || new Animated.Value(-10)
      this.middleBarOpacity = this.middleBarOpacity || new Animated.Value(0)
    }

    this.containerAnim = this.containerAnim || new Animated.Value(0)
    this.topBar = this.topBar || new Animated.Value(0)
    this.bottomBar = this.bottomBar || new Animated.Value(0)
    this.middleBarOpacity = this.middleBarOpacity || new Animated.Value(1)
    this.bottomBarMargin = this.bottomBarMargin || new Animated.Value(4)
    this.topBarMargin = this.topBarMargin || new Animated.Value(0)
    this.marginLeft = this.marginLeft || new Animated.Value(0)
    this.width = this.width || new Animated.Value(25)

    return (
      <TouchableWithoutFeedback
        onPress={() => { if (this.props.onPress) { this.props.onPress() }; this._animate() }}>
        <Animated.View style={{
          width: 35,
          justifyContent: 'center',
          alignItems: 'center',
          height: 35,
          transform: [
            {rotate: this.containerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                '0deg', '360deg'
              ]
            })}
          ]
        }}>
          <Animated.View style={{
            height: 3,
            marginLeft: this.marginLeft,
            width: this.width,
            marginBottom: this.topBarMargin,
            backgroundColor: color || 'black',
            transform: [
              {rotate: this.topBar.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  '0deg', '-50deg'
                ]
              })}
            ]
          }} />
          <Animated.View style={{
            height: 3,
            width: 25,
            opacity: this.middleBarOpacity,
            backgroundColor: color || 'black',
            marginTop: 4}} />
          <Animated.View style={{
            height: 3,
            marginLeft: this.marginLeft,
            width: this.width,
            backgroundColor: color || 'black',
            marginTop: this.bottomBarMargin,
            transform: [
              {rotate: this.bottomBar.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  '0deg', '50deg'
                ]
              })}
            ]
          }} />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

export default compose(
  connect(state => state)
)(Hamburger)
