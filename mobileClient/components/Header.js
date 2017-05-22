import React from 'react'
import { View } from 'react-native'
import SvgUri from 'react-native-svg-uri'

const logoBig = require('../images/logoBig.svg')
import styles from '../styles/styles'

export default class Header extends React.Component {
  render () {
    return (
      <View style={styles.header}>
        <SvgUri
          style={{
            width: 170,
            height: 45,
            transform: [
              { scale: 0.84 }
            ]
          }}
          width='250'
          height='65'
          source={ logoBig }
        />
      </View>
    )
  }
}
