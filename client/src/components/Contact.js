// @flow

import React from 'react'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import androidIcon from '../img/google_play_en.svg'
import iosIcon from '../img/app_store_en.svg'

export class Contact extends React.Component {
  render () {
    return (
      <FlexibleContentWrapper>
        <div className='info-text'>
          Drop us an email at:
          <br />
          <a href='mailto:info@thebrain.pro'>info@thebrain.pro</a>
        </div>

        <div className='info-text' style={{ marginTop: '50px' }}>
          Find out more about TheBrain team:
          <br />
          <a href='http://team.thebrain.pro'>http://team.thebrain.pro</a>
        </div>

        <div className='info-text' style={{ marginTop: '50px' }}>
          Mobile version:
          <div >
            <a href='https://play.google.com/store/apps/details?id=com.thebrain'>
              <img alt={'Google Play'} src={androidIcon} style={{ width: '200px', margin: '10px' }} />
            </a>
            <a disabled href='https://itunes.apple.com/us/app/the-brain-pro/id1281958932'>
              <img alt={'Apple App Store'} src={iosIcon} style={{ width: '200px', margin: '10px' }} />
            </a>
          </div>
        </div>
      </FlexibleContentWrapper>
    )
  }
}

export default Contact
