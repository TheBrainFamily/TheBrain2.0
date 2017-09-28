import React from 'react'

import { View, BackHandler, Platform } from 'react-native'
import Header from './Header'
import MainMenu from './MainMenu'
import { withRouter } from 'react-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class PageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mainMenuActive: false
    }
  }

  toggleMainMenu = () => {
    this.setState({ mainMenuActive: !this.state.mainMenuActive })
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
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
      <Header toggleMainMenu={this.toggleMainMenu}/>
      {this.state.mainMenuActive ? <MainMenu toggleMainMenu={this.toggleMainMenu}/> : this.props.children}
    </View>)

  renderKeyboardAwareContainer = () => (
    <KeyboardAwareScrollView style={{
      height: '100%',
      backgroundColor: 'white'
    }}>
      <View style={{
        height: '100%',
      }}>
        <Header hideHamburger={this.props.hideHamburger} toggleMainMenu={this.toggleMainMenu}/>
        {this.state.mainMenuActive ? <MainMenu toggleMainMenu={this.toggleMainMenu}/> : this.props.children}
      </View>
    </KeyboardAwareScrollView>)

  render () {
    return this.props.dontUseKeyboarAware || Platform.OS === 'android' ? this.renderContainer() : this.renderKeyboardAwareContainer()
  }
}

export default withRouter(PageContainer)
