// @flow

import React from 'react'
import { Link } from 'react-router-native'
import {
  Text,
  View,
} from 'react-native'
import styles from '../styles/styles'

export class WellDone extends React.Component {
  render () {
    return <View style={styles.wellDonePage}>
      <Link to="/Questions">
        <View style={styles.wellDoneContainer}>
          <Text style={[styles.primaryHeader, styles.wellDoneHeader]}>FIRST VIDEO DONE!</Text>
          <Text style={[styles.primaryHeader, styles.wellDoneContent]}>Tap anywhere to answer some questions about the
            video</Text>
        </View>
      </Link>
    </View>
  }
}

export default WellDone
