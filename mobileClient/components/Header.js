import React from 'react'
import { withRouter } from 'react-router'
import { Animated, TouchableOpacity, View, Platform} from 'react-native'
import SvgUri from 'react-native-svg-uri'

import Hamburger from 'react-native-hamburger'

import logoBig from '../images/logoBig.svg'
import styles from '../styles/styles'
import appStyle from '../styles/appStyle'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      topPosition: new Animated.Value(0)
    }
  }

  componentDidUpdate = () => {
    this.state.topPosition.setValue(0)
    if (this.props.hide) {
      Animated.timing(this.state.topPosition, {
        toValue: -120,
        duration: 1000
      }).start()
    }
  }

  goHome = () => {
    if (this.state.active) this.toggleMenu()
    this.props.history.push('/questions')
  }

  toggleMenu = () => {
    this.setState({ active: !this.state.active })
    this.props.toggleMainMenu()
  }

  render () {
    const headerStyle = [styles.header, { height: appStyle.header.height }]
    if (this.props.withShadow) {
      headerStyle.push(styles.headerWithShadow)
    }

    if (this.props.dynamic) {
      headerStyle.push({ position: 'absolute', width: '100%' })
    }

    const dynamicHeaderStyle = Platform.OS === 'ios' ? {zIndex: 1000} : {}

    return (
      <Animated.View style={[{top: this.state.topPosition}, dynamicHeaderStyle]}>
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

      </Animated.View>
    )
  }
}

export default withRouter(Header)
