// @flow

import React from 'react'
import FlexibleContentWrapper from './FlexibleContentWrapper'

export class Contact extends React.Component {
  render () {
    return (
      <FlexibleContentWrapper>
        <div className='info-text'>
          Drop us an email at:
          <br />
          <a href='mailto:info@thebrain.pro'>info@thebrain.pro</a>
        </div>

        <div className='info-text' style={{marginTop: '50px'}}>
          Find out more about TheBrain team:
          <br />
          <a href='http://team.thebrain.pro'>http://team.thebrain.pro</a>
        </div>
      </FlexibleContentWrapper>
    )
  }
}

export default Contact
