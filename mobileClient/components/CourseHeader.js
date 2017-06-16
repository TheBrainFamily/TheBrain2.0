import React from 'react'
import { withRouter } from 'react-router'
import { Text, TouchableOpacity, View } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import Hamburger from 'react-native-hamburger'

import ProgressBar from './ProgressBar'

import styles from '../styles/styles'

class CourseHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  hideMenu = () => {
    this.setState({ active: !this.state.active })
  }

  goHome = () => {
    this.props.history.push('/')
  }

  render () {
    return (
      <View style={styles.courseHeader}>
        <View style={styles.questionHeaderFluxContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={this.goHome}>
              <SvgUri width="100" height="49" source={require('../images/logo.svg')} />
            </TouchableOpacity>
            <View style={styles.headerBorder}><Text style={styles.headerTitle}>Chemistry</Text></View>
          </View>
          <View style={{ marginRight: 15 }}>
            <Hamburger active={this.state.active} color="#ffffff" type="spinCross" onPress={this.hideMenu} />
          </View>

        </View>

        <ProgressBar />
      </View>
    )
  }
}

export default withRouter(CourseHeader)
