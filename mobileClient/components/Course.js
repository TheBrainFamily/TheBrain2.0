import React from 'react'
import { View } from 'react-native'

import Header from './Header'
import ProgressBar from './ProgressBar'
import Lecture from './Lecture'

export default class Course extends React.Component {
  render () {
    return (
      <View>
        <Header withShadow />

        <View style={{ alignItems: 'center' }}>
          <ProgressBar />

          <Lecture />
        </View>
      </View>
    )
  }
}
