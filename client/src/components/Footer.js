// @flow

import React from 'react'

export default class Footer extends React.Component {
  render () {
    return (
      <div className='contact' id='nav3'>
        <h2>Contact us</h2>
        <div className='social-media'>
          <a href='#'>
            <p className='facebook'>
              <img className='facebook1' src='http://s2.ifotos.pl/img/fbpng_shxqqwh.png' alt='Facebook logo' />
              Facebook
            </p>
          </a>
          <a href='#'>
            <p className='twitter'>
              <img className='twitter1' src='http://s5.ifotos.pl/img/twitterpn_shxqqwx.png' alt='Twitter logo' />
              Twitter
            </p>
          </a>
          <a href='#'>
            <p className='google'>
              <img className='google1' src='http://s2.ifotos.pl/img/googlepng_shxqqwr.png' alt='Google logo' />
              Google+
            </p>
          </a>
          <a href='mailto:lgandecki@thebrain.pro'>
            <p className='email'>
              <img className='email1' src='http://s10.ifotos.pl/img/emailpng_shxqqqq.png' alt='Email logo' />
              Email: info@thebrain.pro
            </p>
          </a>
        </div>
      </div>)
  }
}
