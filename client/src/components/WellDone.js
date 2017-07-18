// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import FlexibleContentWrapper from './FlexibleContentWrapper'

export class WellDone extends React.Component {
  render () {
    return <FlexibleContentWrapper>
      <h2 className='welldone'>
        First video done!
        <br/>
        Click: <Link to={`/questions`}>here</Link> to answer some questions about the video
      </h2>
    </FlexibleContentWrapper>
  }
}

export default WellDone
