// @flow
import 'sweetalert2/dist/sweetalert2.min.css'
import React from 'react'
import { lecturesWrapper } from './lecturesWrapper'
import { VideoPreview } from './components/VideoPreview'

class Lectures extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !!nextProps.selectedCourse
  }

  render () {
    const videosElements = this.props.currentLesson.Lesson && this.props.lessons.Lessons && this.props.lessons.Lessons.map(lesson =>
      <div key={lesson.youtubeId} style={{
        display: 'inline-block',
        margin: '1%',
        opacity: lesson.position > this.props.currentLesson.Lesson.position ? 0.6 : 1,
        width: '320px'
      }}>
        <VideoPreview {...this.props} lesson={lesson}
          locked={lesson.position > this.props.currentLesson.Lesson.position} />
        <div style={{textAlign: 'center'}}>{lesson.description}</div>
      </div>
    )
    return (
      <div>
        <h1>LECTURES LIST - {this.props.selectedCourse && this.props.selectedCourse.name.toUpperCase()}</h1>
        {videosElements}
      </div>

    )
  }
}

export default lecturesWrapper(Lectures, ['currentLesson', 'lessons'])
