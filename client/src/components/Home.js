// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { course } from '../actions'

import coursesQuery from '../../shared/graphql/queries/courses'
import airplane from '../img/bg-airplane.png'

class Home extends React.Component {
  selectCourse = (courseId) => async () => {
    this.props.dispatch(course.select(courseId))
    await this.props.selectCourse({ courseId })
    this.props.dispatch(push(`/course/${courseId}`))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.courses.loading || nextProps.userDetails.loading) {
      return
    }

    if (nextProps.userDetails.UserDetails.selectedCourse) {
      const courseId = nextProps.userDetails.UserDetails.selectedCourse
      nextProps.dispatch(push(`/course/${courseId}`))
    }
  }

  render () {
    if (this.props.courses.loading || this.props.userDetails.loading ) {
      return (<p>Loading...</p>)
    }

    return (
        <ul className='course-selector'>
          <h2>Choose a course:</h2>
          {this.props.courses.Courses.map(course => {
            return <li key={course._id}><a className='course-button' onClick={this.selectCourse(course._id)}>{course.name}</a>
            </li>
          })}
        </ul>
    )
  }
}

const selectCourseMutation = gql`
    mutation selectCourse($courseId: String!) {
        selectCourse(courseId: $courseId) {
            success
        }
    }
`

const userDetailsQuery = gql`
    query UserDetails {
        UserDetails {
            selectedCourse
        }
    }
`

export default compose(
  connect(),
  graphql(selectCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      selectCourse: ({ courseId }) => mutate({
        variables: {
          courseId
        }
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(coursesQuery, { name: 'courses' })
)(Home)
