// @flow
/* eslint-env browser */

import React from 'react'
import { compose, withApollo, graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { course } from '../actions'

import logo from '../img/logo.svg'

import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import closeCourseMutation from 'thebrain-shared/graphql/mutations/closeCourse'
import Hamburger from './Hamburger'
import MenuProfile from './MenuProfile'

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

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id, username, activated, facebookId, currentAccessToken
        }
    }
`

const LoginSwitcherWithGraphQl = compose(
  withApollo,
  connect(),
  graphql(logOutQuery, {
    props: ({ ownProps, mutate }) => ({
      logout: () => mutate({
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult LOGOUT', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logOut
              }
            })
          }
        }
      })
    })
  })
)(LoginSwitcher)

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
                <div id='menu'>
                  {currentUser && currentUser.activated
                    ? <span>
                      <MenuProfile currentUser={currentUser} />
                      <div className={'menu-separator'} />
                    </span>
                    : <div className={'menu-profile-container'} style={{height: 20, backgroundColor: '#eee'}} />
                  }
                  {!this.props.data.loading &&
                    <span>
                      <LoginSwitcherWithGraphQl activated={currentUser && currentUser.activated} />
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
                    {/* <a>ACHIEVEMENTS LIST</a> */}
                    {/* <div className={'menu-separator menu-separator-visible'} /> */}
                    <a className='btn-profile' onClick={() => this.props.dispatch(push('/profile'))}>PROFILE</a>
                    <div className={'menu-separator menu-separator-visible'} />
                  </div>
                  }
                  <a className='btn-contact' onClick={() => this.props.dispatch(push('/contact'))}>CONTACT</a>
                  <div className={'menu-separator'} />
                  <div className={'menu-separator'} />
                </div>
              </Hamburger>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(currentLessonQuery, {
    name: 'currentLesson',
    options: (ownProps) => {
      if (!ownProps.selectedCourse) {
        return ({
          variables: {
            courseId: ''
          }
        })
      }
      const courseId = ownProps.selectedCourse._id
      return ({
        variables: { courseId }
      })
    }
  }),
  graphql(closeCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      closeCourse: () => mutate({
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.closeCourse
              }
            })
          }
        }
      })
    })
  }),
  graphql(currentUserQuery)
)(AppHeader)
