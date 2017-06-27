// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'

import Introduction from './Introduction'
import Content from './Content'

import coursesQuery from '../../shared/graphql/queries/courses'

class Home extends React.Component {
  render () {
    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    return (
      <div>
        <Introduction />
        <Content />

        <h2>Choose a course:</h2>
        <ul className='course-selector'>
          {this.props.data.Courses.map(course => {
            return <li key={course._id}><a className='course-button' href={`/course/${course._id}`}>{course.name}</a>
            </li>
          })}
        </ul>
      </div>
    )
  }
}

const selectCourseMutation = gql`    
    mutation selectCourse($courseId: String!) {
        selectCourse(courseId: $courseId) {
            status
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
  graphql(coursesQuery)
)(Home)
