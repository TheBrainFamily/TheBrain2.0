import React from 'react'
import { View } from 'react-native'

const Separator = (props) => (
  <View style={[style.line, { height: props.height, backgroundColor: props.color }]}>
    <View style={[style.circle, getSize(props), { backgroundColor: props.color }]} />
    <View style={[style.circle, getSize(props), { right: 0, backgroundColor: props.color }]} />
  </View>
)

Separator.defaultProps = {
  color: '#999',
  height: 1,
  circleSize: 10
}

const style = {
  line: {
    position: 'relative',
    zIndex: 1000
  },
  circle: {
    position: 'absolute'
  }
}

function getSize ({ circleSize, height }) {
  return {
    top: -circleSize / 2 + height / 2,
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize
  }
}

export default Separator
