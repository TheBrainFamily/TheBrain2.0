import React from 'react'
import { Text, View } from 'react-native'
import { Link } from 'react-router-native'

import styles from '../styles/styles'

export default class Header extends React.Component {
  render () {
    return (
      <View style={styles.header}>
        <Link to='/'>
          <Text style={styles.headerTitle}>The Brain</Text>
        </Link>
      </View>
    )
  }
}
