import React from 'react'

import logo from '../img/logo.svg'
import androidIcon from '../img/google_play_en.svg'
import iosIcon from '../img/app_store_en.svg'

export default class MobileContainer extends React.Component {
  render () {
    return (
      <div className='Mobile'>
        <div style={{
          width: '100%',
          backgroundColor: 'white',
          padding: '20px',
          paddingBottom: '10px',
          boxSizing: 'border-box'
        }}>
          <img alt={'The Brain Logo'} src={logo} style={{ width: '100%' }} />
        </div>
        <div style={{ marginTop: '100px' }}>
          <a href='https://play.google.com/store/apps/details?id=com.thebrain'>
            <img alt={'Google Play'} src={androidIcon} style={{ width: '80%', margin: '10px' }} />
          </a>
          <a disabled href='https://itunes.apple.com/us/app/the-brain-pro/id1281958932'>
            <img alt={'Apple App Store'} src={iosIcon} style={{ width: '80%', margin: '10px' }} />
          </a>
        </div>
      </div>
    )
  }
}
