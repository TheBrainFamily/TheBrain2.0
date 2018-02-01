// @flow

import React from 'react'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter as Router } from 'react-router-redux'
import Intercom from 'react-intercom'
import smartlookClient from 'smartlook-client'

import Home from '../scenes/Home/Home'
import Course from '../scenes/Course/Course'
import Lecture from '../scenes/Lecture/Lecture'
import Questions from '../scenes/Questions/Questions'
import Profile from '../scenes/Profile/Profile'
import Contact from '../scenes/Contact/Contact'
import Login from '../scenes/Login/Login'
import Header from './components/Header/Header'
import ResetPassword from '../scenes/ResetPassword/ResetPassword'
import ReviewsCalendar from '../scenes/ReviewsCalendar/ReviewsCalendar'
import Congratulations from '../scenes/Congratulations/Congratulations'
import Lectures from '../scenes/Lectures/Lectures'

import AirplaneWrapper from './components/AirplaneWrapper/AirplaneWrapper'
import { mainContainerWrapper } from './mainContainerWrapper'

class MainContainer extends React.Component {
  componentDidMount () {
    smartlookClient.init('071bd1e673b85c528487b73918514edbc7b978b0')
  }
  render () {
    const currentUser = this.props.data.CurrentUser
    let intercomUser
    if (currentUser) {
      intercomUser = {
        user_id: currentUser._id,
        email: currentUser.email,
        name: currentUser.username
      }
      smartlookClient.tag('email', currentUser.email)
      smartlookClient.tag('name', currentUser.username)
      smartlookClient.tag('websiteName', 'thebrain.pro')
    }
    return (
      <Router history={this.props.history}>
        <AirplaneWrapper history={this.props.history}>
          <Header />
          <Switch>
            <Route exact key='Home' path='/' component={Home} />
            <Route exact key='login' path='/login' component={Login} />
            <Route exact key='signup' path='/signup' component={Login} />
            <Route exact key='resetpassword' path='/resetpassword' component={ResetPassword} />
            <Route key='Lecture' path='/lecture/:courseId' component={Lecture} />
            <Route exact key='questions' path='/questions' component={Questions} />
            <Route key='Course' path='/course/:courseId' component={Course} />
            <Route exact key='contact' path='/contact' component={Contact} />
            <Route exact key='congratulations' path='/congratulations' component={Congratulations} />
            {
              currentUser &&
              <div>
                <Route exact key='profile' path='/profile' component={Profile} />
                <Route exact key='calendar' path='/calendar' component={ReviewsCalendar} />
                <Route exact key='lectures' path='/lectures' component={Lectures} />
              </div>
            }
            <Redirect to='/' />
          </Switch>
          <Intercom appID='yndcllpy' {...intercomUser} />
        </AirplaneWrapper>
      </Router>)
  }
}

export default mainContainerWrapper(MainContainer)
