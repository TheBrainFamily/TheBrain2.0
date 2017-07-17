// @flow

import React, { Component } from 'react'
import { Route } from 'react-router'
import { ConnectedRouter as Router } from 'react-router-redux'
import { ApolloProvider } from 'react-apollo'
import store, { client, history } from './store'
import './App.css'
import Home from './components/Home'
import Course from './components/Course'
import WellDone from './components/WellDone'
import Lecture from './components/Lecture'
import Questions from './components/Questions'
import Login from './components/Login'
import Signup from './components/Signup'
import Header from './components/Header'
import ResetPassword from './components/ResetPassword'

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client} store={store}>
        <Router history={history}>
          <div className='App'>
            <Header />
            <Route exact key='Home' path='/' component={Home}/>
            <Route key='Course' path='/course/:courseId' component={Course}/>
            <Route key='Lecture' path='/lecture/:courseId' component={Lecture}/>
            <Route exact key='wellDone' path='/wellDone' component={WellDone}/>
            <Route exact key='questions' path='/questions' component={Questions}/>
            <Route exact key='login' path='/login' component={Login}/>
            <Route exact key='signup' path='/signup' component={Signup}/>
            <Route exact key='resetpassword' path='/resetpassword' component={ResetPassword}/>
          </div>
        </Router>
      </ApolloProvider>
    )
  }
}
export default App
