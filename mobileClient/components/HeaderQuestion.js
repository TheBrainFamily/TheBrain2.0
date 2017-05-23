import React from 'react'
import { Text, View } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import Hamburger from 'react-native-hamburger'

import styles from '../styles/styles'

export default class HeaderQuestion extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  hideMenu = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    return (
      <View style={styles.questionHeader}>
        <View style={styles.questionHeaderFluxContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 14}}>
            <SvgUri width="100" height="49" source={require('../images/logo.svg')}/>
            <View style={styles.headerBorder}><Text style={styles.headerTitle}>Chemistry</Text></View>
          </View>
          <View style={{marginRight: 25}}>
            <Hamburger active={this.state.active} color='#ffffff' type='spinCross' onPress={this.hideMenu} />
          </View>
        </View>
      </View>
    )
  }
}
