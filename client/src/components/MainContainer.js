// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import { Route } from 'react-router'
import { ConnectedRouter as Router } from 'react-router-redux'
import Home from './Home'
import Course from './Course'
import WellDone from './WellDone'
import Lecture from './Lecture'
import Questions from './Questions'
import Login from './Login'
import Signup from './Signup'
import Header from './Header'
import ResetPassword from './ResetPassword'
import coursesQuery from '../../shared/graphql/queries/courses'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import { history } from '../store'
import { connect } from 'react-redux'

class MainContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      backgroundColor: null,
      backgroundImage: null
    }
  }

  render () {
    let courseColor = null
    if (this.props.userDetails.UserDetails && this.props.courses.Courses) {
      const selectedCourse = this.props.courses.Courses.find(course => course._id === this.props.userDetails.UserDetails.selectedCourse)
      if(selectedCourse) {
        courseColor = selectedCourse.color
      }
    }
    return (
      <Router history={history}>
        <div className='App'
             style={{
               backgroundColor: courseColor
             }}>
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
  graphql(coursesQuery, {name: 'courses'})
)(MainContainer)