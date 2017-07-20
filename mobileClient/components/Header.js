import React from 'react'
import { withRouter } from 'react-router'
import { Animated, TouchableOpacity, View } from 'react-native'
import SvgUri from 'react-native-svg-uri'

import Hamburger from 'react-native-hamburger'

import MainMenu from './MainMenu'

import logoBig from '../images/logoBig.svg'
import styles from '../styles/styles'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      topPosition: new Animated.Value(0)
    }
  }

  goHome = () => {
    this.props.history.push('/')
  }

  toggleMenu = () => {
    this.setState({ active: !this.state.active })
  }

  render () {
    const headerStyle = [styles.header]
    if (this.props.withShadow) {
      headerStyle.push(styles.headerWithShadow)
    }

    if (this.props.dynamic) {
      headerStyle.push({ position: 'absolute', width: '100%' })
    }

    this.state.topPosition.setValue(0)
    if (this.props.hide) {
      Animated.timing(this.state.topPosition, {
        toValue: -120,
        duration: 1000
      }).start()
    }

    return (
      <Animated.View style={{ top: this.state.topPosition }}>
        <View style={headerStyle}>
          <TouchableOpacity style={{justifyContent: 'center'}} onPress={this.goHome}>
            <SvgUri
              style={styles.headerLogo}
              width='280'
              height='70'
              source={logoBig}
            />
          </TouchableOpacity>

          <Hamburger
            active={this.state.active}
            color='#62c46c'
            type='spinCross'
            onPress={this.toggleMenu}
            style={{ flex: 1 }}
          />
        </View>

        {this.state.active && <MainMenu />}
      </Animated.View>
    )
  }
}

export default withRouter(Header)
