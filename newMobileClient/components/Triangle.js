import React from 'react'
import { View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import styles from '../styles/styles'

export default class Triangle extends React.Component {
  render () {
    let animation = ''
    switch (this.props.line) {
      case 'top':
        animation = 'fadeInDown'
        break
      case 'bottom':
        animation = 'fadeInUp'
        break
      case 'right':
        animation = 'fadeInRight'
        break
      case 'left':
        animation = 'fadeInLeft'
        break
    }

    if (!this.props.animated) {
      return <View style={[styles.triangle, this.props.style]} />
    }
    return (
      <Animatable.View style={[styles.triangle, this.props.style]} animation={animation} direction='reverse'
        iterationCount='infinite' ref='triangle' />
    )
  }
}
