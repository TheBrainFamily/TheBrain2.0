/* eslint-env browser */

import React from 'react'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import { course } from '../../../../../actions/index'
import { loginSwitcherWrapper } from './loginSwitcherWrapper'

class LoginSwitcher extends React.Component {
  logout = (e) => {
    e.preventDefault()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('accessTokenFb')
    localStorage.removeItem('userIdFb')
    this.props.dispatch(course.close())
    this.props.logout()
      .then(async () => {
        await this.props.client.resetStore()
        this.props.dispatch(push(`/`))
      })
  }

  render () {
    if (this.props.activated) {
      return <Link className='btn-logout' to='#' onClick={this.logout}>LOG OUT</Link>
    }
    return <Link className='btn-login' to='/login'>LOG IN</Link>
  }
}

export default loginSwitcherWrapper(LoginSwitcher)
