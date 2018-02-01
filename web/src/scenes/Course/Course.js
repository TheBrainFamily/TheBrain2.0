// @flow
import React from 'react'
import { push } from 'react-router-redux'
import { courseWrapper } from './courseWrapper'

class Course extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.data || nextProps.data.loading || nextProps.data.error) {
      return
    }

    const courseId = nextProps.match.params.courseId

    if (nextProps.data.Items.length > 0) {
      nextProps.dispatch(push('/questions'))
    } else {
      nextProps.dispatch(push(`/lecture/${courseId}`))
    }
  }

  render () {
    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    return <div />
  }
}

export default courseWrapper(Course)
