import React from 'react'

import { View, BackAndroid } from 'react-native'
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
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount = () => {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    const { history } = this.props
    if (history.index === 0) {
      BackAndroid.exitApp()
      return true
    } else {
      history.goBack()
      return true
    }
  }

  render () {
    return (
      <KeyboardAwareScrollView style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <View style={{
          height: '100%',
          backgroundColor: 'white'
        }}>
          <Header toggleMainMenu={this.toggleMainMenu}/>
          {this.state.mainMenuActive ? <MainMenu toggleMainMenu={this.toggleMainMenu}/> : this.props.children}
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default withRouter(PageContainer)
