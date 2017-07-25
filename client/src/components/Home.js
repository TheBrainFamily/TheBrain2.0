// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { course } from '../actions'

import coursesQuery from '../../shared/graphql/queries/courses'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import CourseIcon from './CourseIcon'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import YouTube from 'react-youtube'

import currentUserQuery from '../../shared/graphql/queries/currentUser'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skipIntro: false
    }
  }

  selectCourse = (courseId) => async () => {
    const selectedCourse = this.props.courses.Courses.find(course=>course._id === courseId)
    this.props.dispatch(course.select(selectedCourse))
    await this.props.selectCourse({courseId})
    this.props.dispatch(push(`/course/${courseId}`))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.courses.loading || nextProps.userDetails.loading) {
      return
    }

    if (nextProps.userDetails.UserDetails.selectedCourse) {
      const courseId = nextProps.userDetails.UserDetails.selectedCourse
      const selectedCourse = nextProps.courses.Courses.find(course=>course._id === courseId)

      nextProps.dispatch(course.select(selectedCourse))
      nextProps.dispatch(push(`/course/${courseId}`))
    }
  }

  _onIntroEnd = () => {
    this.setState({
      skipIntro: true
    })
  }

  render () {
    if (this.props.courses.loading || this.props.userDetails.loading) {
      return (<p>Loading...</p>)
    }
    const opts = {
      height: '432',
      width: '768',
      playerVars: {
        autoplay: 0
      }
    }

    const showIntro = !this.props.currentUser.CurrentUser && !this.state.skipIntro

    return (
      <FlexibleContentWrapper offset={200}>
        {showIntro ? <div id='video'>
          <h2>Remember for life, not for exams.<br/>
            Learn smart and save your time.</h2>
          <YouTube
            className={'youTube-player'}
            videoId='vvYTsbp2CRw'
            opts={opts}
            onEnd={this._onIntroEnd}
          />
          <br/>
          <div className="skip-tutorial-button" onClick={this._onIntroEnd}>Skip intro and start learning</div>
        </div> : <ul className='course-selector'>
          <h2>Choose a course:</h2>
          {this.props.courses.Courses.map(course => {
            return <CourseIcon size={150} key={course._id} name={course.name} onClick={this.selectCourse}
                          onClickArgument={course._id}>
                <div>{course.name}</div>
              </CourseIcon>
          })}
        </ul>}
      </FlexibleContentWrapper>
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

export default compose(
  connect(),
  graphql(currentUserQuery, {name: 'currentUser'}),
  graphql(selectCourseMutation, {
    props: ({ownProps, mutate}) => ({
      selectCourse: ({courseId}) => mutate({
        variables: {
          courseId
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(coursesQuery, {name: 'courses'})
)(Home)
