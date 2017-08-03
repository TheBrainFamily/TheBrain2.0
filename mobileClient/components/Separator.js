import React from 'react'
import {View} from 'react-native'

const Separator = (props) => (
  <View style={{alignSelf: 'center', justifyContent: 'center', height: props.circleSize, width: '90%'}}>
    <View style={[style.line, {height: props.height, width: '100%', backgroundColor: props.color, alignSelf: 'center'}]}/>
    <View style={[style.circle, getSize(props), {backgroundColor: props.color, alignSelf: 'flex-start'}]}/>
    <View style={[style.circle, getSize(props), {backgroundColor: props.color, alignSelf: 'flex-end'}]}/>
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
  },
  circle: {
    position: 'absolute'
  }
}

function getSize ({ circleSize }) {
  return {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize
  }
}

export default Separator
