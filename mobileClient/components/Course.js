import React from 'react'
import { View } from 'react-native'

import Lecture from './Lecture'

export default class Course extends React.Component {
  render () {
    return (
      <View style={{ height: '100%' }}>
        <View style={{ alignItems: 'center' }}>
          <Lecture />
        </View>
      </View>
    )
  }
}
