import Intro from './scenes/Intro/Intro'
import Congratulations from './scenes/Congratulations/Congratulations'
import NoInternet from './components/NoInternet'
import Contact from './scenes/Contact/Contact'
import Calendar from './scenes/Calendar/Calendar'
import styles from './styles/styles'
import Lectures from './scenes/Lectures/Lectures'
import Profile from './scenes/Profile/Profile'
import React, { Component } from 'react'
import Questions from './scenes/Questions/Questions'
import Login from './scenes/Login/Login'
import Home from './scenes/Home/Home'
import { NativeRouter, Route } from 'react-router-native'
import { SafeAreaView, View } from 'react-native'
import Page from './components/Page'

export class AppInternal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      backgroundColor: 'white'
    }
    this.RouteWithProps = ({component: Component, ...rest}) => <Route {...rest} render={props => <Component {...props} changeSafeAreaViewBackground={this.changeSafeAreaViewBackground.bind(this)} />} />
  }

  changeSafeAreaViewBackground (color) {
    this.setState({backgroundColor: color || 'white'})
  }

  render () {
    return (<NativeRouter>
      <SafeAreaView style={{backgroundColor: this.state.backgroundColor}}>
        <View style={styles.mainPage}>
          <View style={styles.topContainer} />
          {this.props.fontLoaded ? <Page>
            <this.RouteWithProps exact path='/' component={Home} />
            <this.RouteWithProps exact path='/intro' component={Intro} />
            <this.RouteWithProps exact path='/congratulations' component={Congratulations} />
            <this.RouteWithProps exact path='/questions' component={Questions} />
            <this.RouteWithProps exact path='/login' component={Login} />
            <this.RouteWithProps exact path='/lectures' component={Lectures} />
            <this.RouteWithProps exact path='/calendar' component={Calendar} />
            <this.RouteWithProps exact path='/profile' component={Profile} />
            <this.RouteWithProps exact path='/contact' component={Contact} />
            <this.RouteWithProps exact path='/nointernet' component={NoInternet} />
          </Page> : null }
        </View>
      </SafeAreaView>
    </NativeRouter>)
  }
}
