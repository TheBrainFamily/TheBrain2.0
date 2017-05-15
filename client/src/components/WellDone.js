// @flow

import React from 'react'
import {Link} from 'react-router-dom'

export class WellDone extends React.Component {
  render () {
    return <div className='welldone'>
      First video done! Click: <Link to={`/questions`}>here</Link> to answer some questions about the video
    </div>
  }
}

export default WellDone
