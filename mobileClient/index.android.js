// @flow

import React, {Component} from 'react'
import {ApolloProvider} from 'react-apollo'
import {
  AppRegistry,
  View
} from 'react-native'
import {NativeRouter, Route} from 'react-router-native'

import Page from './components/Page'
import Home from './components/Home'
import Intro from './components/Intro'
import Congratulations from './components/Congratulations'
import Course from './components/Course'
import Lecture from './components/Lecture'
import Questions from './components/Questions'
import styles from './styles/styles'
// import Footer from './components/Footer';
import Login from './components/Login'
import Lectures from './components/Lectures'
import Calendar from './components/Calendar'
import Achievements from './components/Achievements'
import Profile from './components/Profile'
import Contact from './components/Contact'
import store, { client } from './store'

export default class App extends Component {
  render () {
    return (
      <ApolloProvider client={client} store={store}>
        <NativeRouter>
          <View style={styles.mainPage}>
            <View style={styles.topContainer} />
            <Page>
              <Route exact path='/' component={Home} />
              <Route exact path='/intro' component={Intro} />
              <Route exact path='/congratulations' component={Congratulations} />
              <Route exact path='/course' component={Course} />
              <Route exact path='/lecture' component={Lecture} />
              <Route exact path='/questions' component={Questions} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/lectures' component={Lectures} />
              <Route exact path='/calendar' component={Calendar} />
              <Route exact path='/achievements' component={Achievements} />
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/contact' component={Contact} />
            </Page>
          </View>
        </NativeRouter>
      </ApolloProvider>
    )
  }
};

// { <Route exact key="lecture" path="/lecture" component={Lecture}/>
// }

AppRegistry.registerComponent('mobileClient', () => App)
