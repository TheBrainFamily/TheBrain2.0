import React from 'react'
import { View } from 'react-native'

import Lecture from './Lecture'

export default class Course extends React.Component {
  render () {
    return (
      <View style={{ height: '100%', backgroundColor: this.props.backgroundColor }}>
        <View style={{ alignItems: 'center' }}>
          <Lecture />
        </View>
      </View>
    )
  }
}

Course.defaultProps = {
  backgroundColor: 'transparent'
}
