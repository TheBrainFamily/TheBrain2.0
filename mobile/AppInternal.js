import Intro from './components/Intro'
import Congratulations from './components/Congratulations'
import NoInternet from './components/NoInternet'
import Contact from './components/Contact'
import Calendar from './scenes/Calendar/Calendar'
import styles from './styles/styles'
import Lectures from './components/Lectures'
import Profile from './components/Profile'
import React, { Component } from 'react'
import Questions from './components/Questions'
import Login from './components/Login'
import Home from './components/Home'
import { NativeRouter, Route } from 'react-router-native'
import { SafeAreaView, View } from 'react-native'
import Page from './components/Page'

export class AppInternal extends Component {
  render () {
    return (<NativeRouter>
      <SafeAreaView style={{backgroundColor: 'transparent'}}>
        <View style={styles.mainPage}>
          <View style={styles.topContainer} />
          {this.props.fontLoaded ? <Page>
            <Route exact path='/' component={Home} />
            <Route exact path='/intro' component={Intro} />
            <Route exact path='/congratulations' component={Congratulations} />
            <Route exact path='/questions' component={Questions} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/lectures' component={Lectures} />
            <Route exact path='/calendar' component={Calendar} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/contact' component={Contact} />
            <Route exact path='/nointernet' component={NoInternet} />
          </Page> : null }
        </View>
      </SafeAreaView>
    </NativeRouter>)
  }
}
