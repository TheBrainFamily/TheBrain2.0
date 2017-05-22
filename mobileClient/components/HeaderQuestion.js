import React from 'react'
import { Text, View } from 'react-native'
import { Link } from 'react-router-native'
import SvgUri from 'react-native-svg-uri'

import styles from '../styles/styles'

export default class HeaderQuestion extends React.Component {
  render () {
    return (
      <View style={styles.questionHeader}>
        <View style={styles.questionHeaderFluxContainer}>
          <SvgUri width="80" height="61" source={require('../images/logo.svg')}/>
          <Text style={styles.headerTitle}>Chemistry</Text>
        </View>
      </View>
    )
  }
}
