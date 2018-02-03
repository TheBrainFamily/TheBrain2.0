import React from 'react'

import { View, BackHandler, Platform } from 'react-native'
import Header from './Header'
import MainMenu from '../scenes/MainMenu/MainMenu'
import { withRouter } from 'react-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'
import * as mainMenuActions from '../actions/MainMenuActions'

class PageContainer extends React.Component {
  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    if (this.props.mainMenu.visible) {
      this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
        visible: false
      }))
      return true
    }
    const { history } = this.props
    if (history.index === 0) {
      BackHandler.exitApp()
      return true
    } else {
      history.goBack()
      return true
    }
  }

  renderContainer = () => (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      <Header />
      {this.props.mainMenu.visible ? <MainMenu /> : this.props.children}
    </View>)

  renderKeyboardAwareContainer = () => (
    <KeyboardAwareScrollView style={{
      height: '100%',
      backgroundColor: 'white'
    }}>
      <View style={{
        height: '100%'
      }}>
        <Header hideHamburger={this.props.hideHamburger} />
        {this.props.mainMenu.visible ? <MainMenu /> : this.props.children}
      </View>
    </KeyboardAwareScrollView>)

  render () {
    return this.props.dontUseKeyboarAware || Platform.OS === 'android' ? this.renderContainer() : this.renderKeyboardAwareContainer()
  }
}

export default compose(
  connect(state => state),
  withRouter
)(PageContainer)
