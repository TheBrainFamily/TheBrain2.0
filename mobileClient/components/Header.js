import React from 'react'
import { withRouter } from 'react-router'
import { View, TouchableOpacity } from 'react-native'
import SvgUri from 'react-native-svg-uri'

import Hamburger from 'react-native-hamburger'

import logoBig from '../images/logoBig.svg'
import styles from '../styles/styles'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  goHome = () => {
    this.props.history.push('/')
  }

  hideMenu = () => {
    this.setState({ active: !this.state.active })
  }

  render () {
    const headerStyle = [ styles.header ]
    if (this.props.withShadow) {
      headerStyle.push(styles.headerWithShadow)
    }

    return (
      <View style={ headerStyle }>
        <TouchableOpacity onPress={this.goHome}>
          <SvgUri
            style={{
              padding: 0,
              marginLeft: -10,
              marginTop: -25,
              marginBottom: 0,
              width: 250,
              height: 65,
              flex: 1,
              transform: [
                { scale: 0.83 }
              ]
            }}
            width='250'
            height='65'
            source={ logoBig }
          />
        </TouchableOpacity>

        <Hamburger active={this.state.active} color='#662e8f' type='spinCross' onPress={this.hideMenu} style={{ marginTop: 30, flex: 1 }} />
      </View>
    )
  }
}

export default withRouter(Header)
