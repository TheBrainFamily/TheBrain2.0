import React from 'react'

import logo from '../img/logo.svg'
import androidIcon from '../img/google_play_en.svg'
import iosIcon from '../img/app_store_en.svg'

export default class MobileContainer extends React.Component {
  render () {
    return (
      <div className="Mobile">
        <div style={{
          width: '100%',
          backgroundColor: 'white',
          padding: '20px',
          paddingBottom: '10px',
          boxSizing: 'border-box'
        }}>
          <img src={logo} style={{ width: '100%' }}/>
        </div>
        <div style={{ marginTop: '100px' }}>
          <a href=''><img src={androidIcon} style={{ width: '80%', margin: '10px' }}/></a>
          <a href='https://itunes.apple.com/us/app/the-brain-pro/id1281958932'><img src={iosIcon} style={{ width: '80%', margin: '10px' }}/></a>
        </div>
      </div>
    )
  }
}