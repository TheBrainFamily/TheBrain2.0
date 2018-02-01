// @flow
/* eslint-env browser */

import React from 'react'
import { push } from 'react-router-redux'
import YouTube from 'react-youtube'
import _ from 'lodash'

import CourseIcon from '../../components/CourseIcon'
import FlexibleContentWrapper from '../../components/FlexibleContentWrapper'
import androidIcon from '../../img/google_play_en.svg'
import iosIcon from '../../img/app_store_en.svg'
import { course } from '../../actions/index'
import { homeWrapper } from './homeWrapper'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skipIntro: false,
      loginInProgress: false
    }
  }

  logInWithSavedData = async () => {
    const deviceId = 'browser'
    const userId = localStorage.getItem('userId')
    const userIdFb = localStorage.getItem('userIdFb')
    const accessToken = localStorage.getItem('accessToken')
    const accessTokenFb = localStorage.getItem('accessTokenFb')

    if (this.state.loginInProgress) {
      return
    }

    this.setState({
      loginInProgress: true
    }, async () => {
      if (userId && accessToken) {
        await this.props.logInWithToken({ accessToken, userId, deviceId })
          .then(async () => {
            const newAccessToken = this.props.currentUser.CurrentUser.currentAccessToken
            await localStorage.setItem('accessToken', newAccessToken)
            this.setState({ loginInProgess: false })
          })
          .catch(async () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('userId')
            this.setState({ loginInProgess: false }, () => {
              this.props.dispatch(push('/login'))
            })
          })
      }

      if (userIdFb && accessTokenFb) {
        console.log('loguje z FB ', accessTokenFb, userIdFb)
        this.props.logInWithFacebook({ accessTokenFb, userIdFb })
          .then(() => {
            this.setState({ loginInProgess: false })
          })
          .catch(async () => {
            localStorage.removeItem('accessTokenFb')
            localStorage.removeItem('userIdFb')
            this.setState({ loginInProgess: false }, () => {
              this.props.dispatch(push('/login'))
            })
          })
      }
    })
  }

  selectCourse = (courseId, courses = null) => async () => {
    const coursesToProcess = courses === null ? this.props.courses.Courses : courses
    const selectedCourse = _.find(coursesToProcess, course => course._id === courseId)
    this.props.dispatch(course.select(selectedCourse))
    await this.props.selectCourse({ courseId })
    this.props.dispatch(push(`/course/${courseId}`))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.courses.loading || nextProps.userDetails.loading || nextProps.currentUser.loading) {
      return
    }

    if (!nextProps.currentUser.CurrentUser || !nextProps.currentUser.CurrentUser.activated) {
      this.logInWithSavedData()
    }

    if (nextProps.userDetails && nextProps.userDetails.UserDetails && nextProps.userDetails.UserDetails.selectedCourse) {
      this.selectCourse(nextProps.userDetails.UserDetails.selectedCourse, nextProps.courses.Courses)()
    }
  }

  _onIntroEnd = () => {
    this.setState({
      skipIntro: true
    })
  }

  render () {
    const opts = {
      height: '432',
      width: '768',
      playerVars: {
        autoplay: 0
      }
    }
    const showIntro = !this.props.currentUser.CurrentUser && !this.state.skipIntro
    if (this.props.courses.loading || this.props.currentUser.loading || this.props.userDetails.loading || this.props.selectedCourse) {
      return <p>Loading...</p>
    }
    return (
      <FlexibleContentWrapper offset={200}>
        {showIntro ? <div id='video'>
          <h2>Remember for life, not for exams.<br />
            Learn smart and save your time.</h2>
          <YouTube
            className={'youTube-player'}
            videoId='vvYTsbp2CRw'
            opts={opts}
            onEnd={this._onIntroEnd}
          />
          <br />
          <div className='skip-tutorial-button' onClick={this._onIntroEnd}>Skip intro and start learning</div>
        </div> : <ul className='course-selector'>
          <h2>Choose a course:</h2>
          {this.props.courses.Courses.map(course => {
            return <CourseIcon size={150} key={course._id} name={course.name} onClick={this.selectCourse}
              onClickArgument={course._id} isDisabled={course.isDisabled}>
              <div>{course.name}</div>
            </CourseIcon>
          })}
        </ul>}
        <div style={{ height: '100px' }} />
        <div className='oldBrainLinkContainer'>
          <div>
            <a href='https://play.google.com/store/apps/details?id=com.thebrain'>
              <img alt={'Google Play'} src={androidIcon} style={{ width: '150px', margin: '10px' }} />
            </a>
            <a disabled href='https://itunes.apple.com/us/app/the-brain-pro/id1281958932'>
              <img alt={'Apple App Store'} src={iosIcon} style={{ width: '150px', margin: '10px' }} />
            </a>
          </div>
          Looking for the previous version of TheBrain?
          Click <a href='https://legacy.thebrain.pro'>here</a> | <a href='policy.html'>Privacy policy</a>
        </div>
      </FlexibleContentWrapper>
    )
  }
}

export default homeWrapper(Home)
