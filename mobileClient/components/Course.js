import React from 'react'
import { View } from 'react-native'

import CourseHeader from './CourseHeader'
import Lecture from './Lecture'

export default class Course extends React.Component {
  render () {
    return (
      <View style={{ height: '100%', position: 'relative' }}>
        <CourseHeader onLogoPress={this.props.onCloseCurse} />

        <View style={{ alignItems: 'center' }}>
          <Lecture />
        </View>
      </View>
    )
  }
}
