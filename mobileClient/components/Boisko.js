import React from 'react'
import { withRouter } from 'react-router'
import { View, Text } from 'react-native'
import SvgUri from 'react-native-svg-uri'

import logoBig from '../images/logoBig.svg'
import styles from '../styles/styles'

class Boisko extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  render () {
    return <Text>{"Boisko"}</Text>
  }
}

export default Boisko
