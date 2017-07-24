// @flow

import React from 'react'
import { compose, withApollo, graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import logo from '../img/logo.svg'

import currentUserQuery from '../../shared/graphql/queries/currentUser'
import Hamburger from './Hamburger'
import MenuProfile from './MenuProfile'

class LoginSwitcher extends React.Component {
  logout = (e) => {
    e.preventDefault()
    this.props.logout()
      .then(() => {
        this.props.client.resetStore()
        this.props.dispatch(push(`/`))
      })
  }

  render () {
    if (this.props.activated) {
      return <Link to='/logout' onClick={this.logout}>LOGOUT</Link>
    }
    return <Link to='/login'>LOGIN</Link>
  }
}

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id, username, activated
        }
    }
`

const LoginSwitcherWithGraphQl = connect()(withApollo(graphql(logOutQuery, {
  props: ({ ownProps, mutate }) => ({
    logout: () => mutate({
      updateQueries: {
        CurrentUser: (prev, { mutationResult }) => {
          console.log('Gozdecki: mutationResult', mutationResult)
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
})(LoginSwitcher)))

class AppHeader extends React.Component {
  closeCourse = () => async () => {
    await this.props.closeCourse()
    this.props.dispatch(push('/'))
  }

  render() {
    const currentUser = this.props.data.CurrentUser

    return (
      <div className='App-header-shadow'>
        <div className='App-header-container'>
          <div className='App-header'>
            <Link to='/'>
              <img src={logo} className='App-logo' alt='logo' />
            </Link>
            <div className='App-header-right'>
              <Hamburger>
                {currentUser && currentUser.activated
                  ?
                  <span>
                    <MenuProfile currentUser={currentUser}/>
                    <div className={'menu-separator'}/>
                  </span>
                  : <div className={'menu-profile-container'} style={{height: 20, backgroundColor: '#eee'}}/>
                }
                {!this.props.data.loading &&
                  <span>
                    <LoginSwitcherWithGraphQl activated={currentUser && currentUser.activated} />
                    <div className={'menu-separator menu-separator-visible'}/>
                  </span>
                }
                <a>LECTURES LIST</a>
                <div className={'menu-separator menu-separator-visible'}/>
                <a>REVIEWS CALLENDAR</a>
                <div className={'menu-separator menu-separator-visible'}/>
                <a onClick={this.closeCourse()}>CHANGE THE COURSE</a>
                <div className={'menu-separator menu-separator-visible'}/>
                <a>ACHIEVEMENTS LIST</a>
                <div className={'menu-separator menu-separator-visible'}/>
                <a>PROFILE</a>
                <div className={'menu-separator menu-separator-visible'}/>
                <a>CONTACT</a>
                <div className={'menu-separator'}/>
                <div className={'menu-separator'}/>
              </Hamburger>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const closeCourseMutation = gql`
    mutation closeCourse {
        closeCourse {
            success
        }
    }
`

export default compose(
  connect(),
  graphql(closeCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      closeCourse: () => mutate({})
    })
  }),
  graphql(currentUserQuery)
)(AppHeader)
