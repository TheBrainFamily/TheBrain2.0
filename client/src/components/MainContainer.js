// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter as Router } from 'react-router-redux'
import { connect } from 'react-redux'

import Home from './Home'
import Course from './Course'
import Lecture from './Lecture'
import Questions from './Questions'
import Profile from './Profile'
import Contact from './Contact'
import Login from './Login'
import Header from './Header'
import ResetPassword from './ResetPassword'
import ReviewsCalendar from './ReviewsCalendar'
import Congratulations from './Congratulations'

import { history } from '../store'

import coursesQuery from '../../shared/graphql/queries/courses'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import currentUserQuery from '../../shared/graphql/queries/currentUser'

class MainContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      backgroundColor: null,
      backgroundImage: null
    }
  }

  render () {
    const currentUser = this.props.data.CurrentUser
    let courseColor = null
    if (this.props.userDetails.UserDetails && this.props.courses.Courses) {
      const selectedCourse = this.props.courses.Courses.find(course => course._id === this.props.userDetails.UserDetails.selectedCourse)
      if (selectedCourse) {
        courseColor = selectedCourse.color
      } else {
        courseColor = '#6920aa'
      }
    }
    return (
      <Router history={history}>
        <div className='App'
          style={{
            backgroundColor: courseColor
          }}>
          <Header />
          <Switch>
            <Route exact key='Home' path='/' component={Home} />
            <Route exact key='login' path='/login' component={Login} />
            <Route exact key='signup' path='/signup' component={Login} />
            <Route exact key='resetpassword' path='/resetpassword' component={ResetPassword} />
            <Route key='Lecture' path='/lecture/:courseId' component={Lecture}/>
            <Route exact key='questions' path='/questions' component={Questions}/>
            <Route key='Course' path='/course/:courseId' component={Course}/>
            <Route exact key='contact' path='/contact' component={Contact} />
            <Route exact key='congratulations' path='/congratulations' component={Congratulations} />
            {
              currentUser &&
              <div>
                <Route exact key='profile' path='/profile' component={Profile} />
                <Route exact key='calendar' path='/calendar' component={ReviewsCalendar} />
              </div>
            }
            <Redirect to='/' />
          </Switch>
        </div>
      </Router>)
  }
}

export default compose(
  connect(),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(coursesQuery, { name: 'courses' }),
  graphql(currentUserQuery)
)(MainContainer)
