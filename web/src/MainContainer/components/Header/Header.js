// @flow

import React from 'react'

import { push } from 'react-router-redux'
import { course } from '../../../actions/index'

import logo from '../../../img/logo.svg'

import Hamburger from './components/Hamburger/Hamburger'
import MenuProfile from './components/MenuProfile/MenuProfile'
import { headerWrapper } from './headerWrapper'
import LoginSwitcher from './components/LoginSwitcher/LoginSwitcher'

class AppHeader extends React.Component {
  closeCourse = () => async () => {
    if (this.props.selectedCourse) {
      await this.props.closeCourse()
      this.props.dispatch(course.close())
    }
    this.props.dispatch(push('/'))
  }

  render () {
    const currentUser = this.props.data.CurrentUser
    return (
      <div className='App-header-shadow'>
        <div className='App-header-container'>
          <div className='App-header'>
            <img onClick={this.closeCourse()} src={logo} className='App-logo' alt='logo' style={{cursor: 'pointer'}} />
            <div className='App-header-right'>
              <Hamburger>
                {currentUser && currentUser.activated
                  ? <span>
                    <MenuProfile currentUser={currentUser} />
                    <div className={'menu-separator'} />
                  </span>
                  : <div className={'menu-profile-container'} style={{height: 20, backgroundColor: '#eee'}} />
                }
                {!this.props.data.loading &&
                  <span>
                    <LoginSwitcher activated={currentUser && currentUser.activated} />
                    <div className={'menu-separator menu-separator-visible'} />
                  </span>
                }
                {currentUser &&
                <div>
                  { this.props.selectedCourse && <a className='btn-lectures' onClick={() => this.props.dispatch(push('/lectures'))}>LECTURES LIST</a> }
                  { this.props.selectedCourse && <div className={'menu-separator menu-separator-visible'} /> }
                  <a className='btn-calendar'onClick={() => this.props.dispatch(push('/calendar'))}>REVIEWS CALENDAR</a>
                  <div className={'menu-separator menu-separator-visible'} />
                  { this.props.selectedCourse && <a className='btn-changeCourse' onClick={this.closeCourse()}>CHANGE THE COURSE</a> }
                  { this.props.selectedCourse && <div className={'menu-separator menu-separator-visible'} /> }
                  <a className='btn-profile' onClick={() => this.props.dispatch(push('/profile'))}>PROFILE</a>
                  <div className={'menu-separator menu-separator-visible'} />
                </div>
                }
                <a className='btn-contact' onClick={() => this.props.dispatch(push('/contact'))}>CONTACT</a>
                <div className={'menu-separator'} />
                <div className={'menu-separator'} />
              </Hamburger>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default headerWrapper(AppHeader)
