// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { course } from '../actions'
import update from 'immutability-helper'
import _ from 'lodash'

import coursesQuery from '../../shared/graphql/queries/courses'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import CourseIcon from './CourseIcon'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import YouTube from 'react-youtube'
import androidIcon from '../img/google_play_en.svg'
import iosIcon from '../img/app_store_en.svg'

import currentUserQuery from '../../shared/graphql/queries/currentUser'
import logInWithFacebook from '../../shared/graphql/mutations/logInWithFacebook'

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
        console.log('loguje z TOKEN', accessToken, userId)
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
          <h2>Remember for life, not for exams.<br/>
            Learn smart and save your time.</h2>
          <YouTube
            className={'youTube-player'}
            videoId='vvYTsbp2CRw'
            opts={opts}
            onEnd={this._onIntroEnd}
          />
          <br/>
          <div className="skip-tutorial-button" onClick={this._onIntroEnd}>Skip intro and start learning</div>
        </div> : <ul className='course-selector'>
          <h2>Choose a course:</h2>
          {this.props.courses.Courses.map(course => {
            return <CourseIcon size={150} key={course._id} name={course.name} onClick={this.selectCourse}
                               onClickArgument={course._id} isDisabled={course.isDisabled}>
              <div>{course.name}</div>
            </CourseIcon>
          })}
        </ul>}
        <div style={{ height: '100px' }}/>
        <div className='oldBrainLinkContainer'>
          <div>
            <a href='https://play.google.com/store/apps/details?id=com.thebrain'>
              <img alt={'Google Play'} src={androidIcon} style={{ width: '150px', margin: '10px' }}/>
            </a>
            <a disabled={true} href='https://itunes.apple.com/us/app/the-brain-pro/id1281958932'>
              <img alt={'Apple App Store'} src={iosIcon} style={{ width: '150px', margin: '10px' }}/>
            </a>
          </div>
          Looking for the previous version of TheBrain?
          Click <a href="https://legacy.thebrain.pro">here</a> | <a href="policy.html">Privacy policy</a>
        </div>
      </FlexibleContentWrapper>
    )
  }
}

const selectCourseMutation = gql`
    mutation selectCourse($courseId: String!) {
        selectCourse(courseId: $courseId) {
            selectedCourse
            hasDisabledTutorial
            isCasual
            experience {
                level
                showLevelUp
            }
        }
    }
`

const logInWithTokenMutation = gql`
    mutation logInWithToken($accessToken: String!, $userId: String!, $deviceId: String!) {
        logInWithToken(accessToken:$accessToken, userId:$userId, deviceId:$deviceId) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(currentUserQuery, { name: 'currentUser' }),
  graphql(logInWithTokenMutation, {
    props: ({ ownProps, mutate }) => ({
      logInWithToken: ({ accessToken, userId, deviceId }) => mutate({
        variables: {
          accessToken,
          userId,
          deviceId
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithToken
              }
            })
          }
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(logInWithFacebook, {
    props: ({ ownProps, mutate }) => ({
      logInWithFacebook: ({ accessTokenFb, userIdFb }) => mutate({
        variables: {
          accessTokenFb,
          userIdFb
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebook
              }
            })
          }
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(selectCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      selectCourse: ({ courseId }) => mutate({
        variables: {
          courseId
        },
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.selectCourse
              }
            })
          }
        },
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(coursesQuery, {
    name: 'courses', options: {
      notifyOnNetworkStatusChange: true //workaround to infininte loading after user relog in apoolo-client > 1.8
    }
  })
)(Home)
