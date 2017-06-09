import React from 'react'
import { Text, View } from 'react-native'

import Header from './Header'
import Lecture from './Lecture'

import styles from '../styles/styles'

export default class Home extends React.Component {
  render () {
    return (
      <View>
        <Header withShadow />

        <View style={{ alignItems: 'center' }}>
          <Text style={[ styles.textDefault, {
            margin: 30,
            width: 200
          }]}>
            Watch video and wait for the question
          </Text>

          <Lecture />
        </View>
      </View>
    )
  }
}
