// eslint-env browser

import React from 'react'
import { withRouter } from 'react-router'
import { Animated, TouchableOpacity, View, Platform, Image } from 'react-native'
import Hamburger from './Hamburger'

import logoBig from '../images/logoBig.png'
import styles from '../styles/styles'
import appStyle from '../styles/appStyle'
import * as mainMenuActions from '../actions/MainMenuActions'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      topPosition: new Animated.Value(0)
    }
  }

  componentDidUpdate = () => {
    if (this.props.hide) {
      Animated.timing(this.state.topPosition, {
        toValue: -120,
        duration: 1000
      }).start()
    }
  }

  goHome = () => {
    if (!this.props.hideHamburger) {
      this.state.topPosition.setValue(0)
      this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
        visible: false
      }))
      this.props.history.push('/questions')
    }
  }

  toggleMenu = () => {
    this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
      visible: !this.props.mainMenu.visible
    }))
  }

  render () {
    const headerStyle = [styles.header, { height: appStyle.header.height }]
    if (this.props.withShadow) {
      headerStyle.push(styles.headerWithShadow)
    }

    if (this.props.dynamic) {
      headerStyle.push({ position: 'absolute', width: '100%' })
    }

    const dynamicHeaderStyle = Platform.OS === 'ios' ? { zIndex: 1000 } : {}

    return (
      <Animated.View style={[{ top: this.state.topPosition }, dynamicHeaderStyle, { width: '100%' }]}>
        <View style={headerStyle}>
          <TouchableOpacity style={{ justifyContent: 'center', width: '90%' }} onPress={this.goHome}>
            <Image
              style={[styles.headerLogo, { height: '100%', width: '80%', marginLeft: 20 }]}
              resizeMode={'contain'}
              source={logoBig}
            />
          </TouchableOpacity>
          {!this.props.hideHamburger ? <Hamburger
            active={this.props.mainMenu.visible}
            color='#62c46c'
            onPress={this.toggleMenu}
          /> : null}
        </View>

      </Animated.View>
    )
  }
}

export default compose(
  connect(state => state),
  withRouter
)(Header)
