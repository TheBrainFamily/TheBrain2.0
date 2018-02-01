import React from 'react'
import _ from 'lodash'
import { airplaneWrapperWrapper } from './airplaneWrapperWrapper'

class AirplaneWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.routesWithAirplane = ['/']
  }

  getBackgroundImage = () => {
    if (this.routesWithAirplane.indexOf(this.props.history.location.pathname) > -1) {
      return null
    } else {
      return 'none'
    }
  }

  render () {
    let courseColor = null
    if (this.props.userDetails.UserDetails && this.props.courses.Courses) {
      const selectedCourse = _.find(this.props.courses.Courses, course => course._id === this.props.userDetails.UserDetails.selectedCourse)
      if (selectedCourse) {
        courseColor = selectedCourse.color
      } else {
        courseColor = '#6920aa'
      }
    }
    return (
      <div className='App'
        style={{
          backgroundColor: courseColor,
          backgroundImage: this.getBackgroundImage()
        }}>
        {this.props.children}
      </div>
    )
  }
}

export default airplaneWrapperWrapper(AirplaneWrapper)
