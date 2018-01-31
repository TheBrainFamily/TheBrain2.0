// @flow

import React from 'react'
import { push } from 'react-router-redux'

import CourseIcon from '../../components/CourseIcon'
import FlexibleContentWrapper from '../../components/FlexibleContentWrapper'
import CourseProgressBar from './components/CourseProgressBar'
import { lectureWrapper } from './lectureWrapper'
import LectureVideo from './components/LectureVideo'

class Lecture extends React.Component {
  _onEnd = async () => {
    const courseId = (this.props.selectedCourse && this.props.selectedCourse._id) || this.props.match.params.courseId
    await this.props.clearNotCasual()
    this.props.lessonWatchedMutation({courseId}).then(() => {
      this.props.dispatch(push('/questions'))
    })
  }

  render () {
    if (this.props.data.loading || this.props.courseData.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    if (!this.props.data.Lesson) {
      return (
        <div>
          <h2>Congratulations!</h2>
          <p>
            You have watched all available lectures in this course.
          </p>
        </div>
      )
    }

    return (
      <span>
        <CourseProgressBar />
        <FlexibleContentWrapper>
          <div id='video'>
            <h2>Watch the video<br />
              and wait for the questions.</h2>
            <LectureVideo lesson={this.props.data.Lesson} onEnd={this._onEnd} />
            <br />
            <div className='skipLecture' onClick={this._onEnd}>Skip intro and start learning</div>
            <CourseIcon simple size={100} name={this.props.courseData.Course.name} />
          </div>
        </FlexibleContentWrapper>
      </span>
    )
  }
}

export default lectureWrapper(Lecture)
