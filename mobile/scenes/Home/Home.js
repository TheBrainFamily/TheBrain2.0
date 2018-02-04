/* global __DEV__ */
import _ from 'lodash'
import React from 'react'
import Expo from 'expo'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  Dimensions,
  Platform,
  Alert,
  Image,
  BackHandler
} from 'react-native'
import * as Animatable from 'react-native-animatable'

import Header from '../../components/Header'
import CircleButton from './components/CircleButton'
import CourseHeader from '../../components/CourseHeader'
import CourseProgressBar from './components/CourseProgressBar'
import Course from './scenes/Course/Course'
import MainMenu from '../../components/MainMenu/'

import * as courseActions from '../../actions/CourseActions'

import styles from '../../styles/styles'
import appStyle from '../../styles/appStyle'
import courseLogos from './helpers/courseLogos'

import coursesQuery from 'thebrain-shared/graphql/courses/courses'
import { getGraphqlForLogInWithFacebookAccessToken } from 'thebrain-shared/graphql/account/logInWithFacebookAccessToken'
import { getGraphqlForCloseCourseMutation } from 'thebrain-shared/graphql/courses/closeCourse'
import { getGraphqlForLogInWithTokenMutation } from 'thebrain-shared/graphql/account/logInWithToken'
import { getGraphqlForSelectCourseSaveTokenMutation } from 'thebrain-shared/graphql/courses/selectCourseSaveToken'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import WithData from '../../components/WithData'
import { mutationConnectionHandler } from '../../components/NoInternet'
import * as mainMenuActions from '../../actions/MainMenuActions'

class Home extends React.Component {
  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.height = height
    this.width = width
    this.state = {
      isExitAnimationFinished: props.course.selectedCourse,
      courseSelectorIsDisabled: false
    }

    AsyncStorage.getItem('isIntroDisabled').then((isIntroDisabled) => {
      if (!isIntroDisabled) {
        props.history.push('/intro')
      }
    })
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    if (this.props.mainMenu.visible) {
      this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
        visible: false
      }))
      return true
    }

    BackHandler.exitApp()
    return true
  }

  logInWithSavedData = async () => {
    const deviceId = Expo.Constants.deviceId
    const userId = await AsyncStorage.getItem('userId')
    const accessToken = await AsyncStorage.getItem('accessToken')
    const accessTokenFb = await AsyncStorage.getItem('accessTokenFb')

    if (userId && accessToken) {
      this.props.logInWithToken({ accessToken, userId, deviceId }).then(async () => {
        const newAccessToken = this.props.currentUser.CurrentUser.currentAccessToken
        await AsyncStorage.setItem('accessToken', newAccessToken)
      }).catch(async () => {
        await AsyncStorage.removeItem('accessToken')
        await AsyncStorage.removeItem('userId')
        Alert.alert('You were logged out', 'Please log in again')
      })
    }

    if (accessTokenFb) {
      await this.props.logInWithFacebookAccessToken({ accessTokenFb }).catch(async () => {
        await AsyncStorage.removeItem('accessTokenFb')
        Alert.alert('Facebook login expired', 'Please log in again')
      })
    }
  }

  isStillLoading (nextProps) {
    return !nextProps.userDetails || nextProps.userDetails.loading || nextProps.userDetails.error ||
      !nextProps.courses || nextProps.courses.loading ||
      !nextProps.currentUser || nextProps.currentUser.loading
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !this.isStillLoading(nextProps)
  }

  componentWillReceiveProps (nextProps) {
    if (this.isStillLoading(nextProps)) {
      return
    }

    if (!nextProps.currentUser.CurrentUser) {
      this.logInWithSavedData()
    }

    const courseId = nextProps.userDetails.UserDetails.selectedCourse
    if (!courseId) {
      return
    }

    const course = nextProps.courses.Courses.find((course) => course._id === courseId)
    this.selectCourse(course)
  }

  getCoursesIds = () => {
    return this.props.courses.Courses.map(course => course._id)
  }

  getOtherCoursesIds = (selectedCourseId) => {
    return this.getCoursesIds().filter(courseId => courseId !== selectedCourseId)
  }

  animateCourseSelectorsFadeOut = (selectedCourseId) => {
    this.refs.courseSelectorTitle.fadeOut(500)

    this.getOtherCoursesIds(selectedCourseId).forEach((courseId) => {
      this.refs[`${courseId}courseSelector`].fadeOut(500)
    })

    this.getCoursesIds().forEach((courseId) => {
      this.refs[`${courseId}courseSelectorText`].fadeOut(500)
    })

    InteractionManager.runAfterInteractions(() => {
      this.setState({ isExitAnimationFinished: true })
    })
  }

  animateCourseSelector = (selectedCourseId) => {
    if (!this.refs[`${selectedCourseId}courseSelectorContainer`]) {
      return
    }
    if (!__DEV__) {
      this.refs[`${selectedCourseId}courseSelectorContainer`].measure((fx, fy, width, height, pageXOffset, pageYOffset) => {
        const scale = 0.75
        const desiredBottomYOffset = 10
        const newSizeY = height * scale
        const desiredElementTopYOffset = desiredBottomYOffset + newSizeY
        let iPhoneOffset = 0
        if (Platform.OS === 'ios' && this.height === 568) iPhoneOffset = 20
        if (Platform.OS === 'ios' && this.height === 667) iPhoneOffset = 31
        if (Platform.OS === 'ios' && this.height === 736) iPhoneOffset = 38.5
        const elementHeightChangeAfterScaling = (height - newSizeY) / 2
        const translateYValue = this.height - pageYOffset - desiredElementTopYOffset - elementHeightChangeAfterScaling - iPhoneOffset

        const newSizeX = width * scale
        const centeredLeftXOffset = (this.width - newSizeX) / 2
        const elementWidthChangeAfterScaling = (width - newSizeX) / 2
        const translateXValue = centeredLeftXOffset - pageXOffset - elementWidthChangeAfterScaling
        const courseLogoIsRendered = width && height

        if (Platform.OS === 'ios' && courseLogoIsRendered) {
          this.refs[`${selectedCourseId}courseSelector`].transitionTo({transform: [{translateX: translateXValue}, {translateY: translateYValue}, {scale}]}, 2000)
        } else {
          this.refs[`${selectedCourseId}courseSelector`].bounceOut(1000)
        }

        this.animateCourseSelectorsFadeOut(selectedCourseId)
      })
    }
  }

  selectCourse = async (course) => {
    if (!this.props.course.selectedCourse) {
      const deviceId = Expo.Constants.deviceId
      this.props.dispatch(courseActions.select(course))
      await mutationConnectionHandler(this.props.history, () => {
        this.props.selectCourseSaveToken({ courseId: course._id, deviceId }).then(async () => {
          if (this.props.currentUser.CurrentUser) {
            if (__DEV__) {
              this.setState({isExitAnimationFinished: true})
            }
            return
          } else {
            await this.props.currentUser.refetch()
          }
          const accessToken = this.props.currentUser.CurrentUser.currentAccessToken
          const userId = this.props.currentUser.CurrentUser._id
          if (userId && accessToken) {
            await AsyncStorage.setItem('accessToken', accessToken)
            await AsyncStorage.setItem('userId', userId)
            if (__DEV__) {
              this.setState({isExitAnimationFinished: true})
            }
          }
        })
      })
      this.animateCourseSelector(course._id)
    }
  }

  disableCourseSelector = () => {
    this.setState({ courseSelectorIsDisabled: true })
  }
  enableCourseSelector = () => {
    this.setState({ courseSelectorIsDisabled: false })
  }

  logoutAction = () => {
    this.closeMenu()
    this.setState({ isExitAnimationFinished: false })
    this.enableCourseSelector()
  }

  closeCourse = async () => {
    await mutationConnectionHandler(this.props.history, async () => {
      await this.props.closeCourse()
      this.props.dispatch(courseActions.close())
      this.setState({ isExitAnimationFinished: false })
      this.closeMenu()
      this.enableCourseSelector()
    })
  }

  closeMenu = () => {
    this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
      visible: false
    }))
  }

  render () {
    const { isExitAnimationFinished } = this.state
    const { course } = this.props
    const courseColor = _.get(course, 'selectedCourse.color')
    return (
      <View style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: courseColor
      }}>
        {!isExitAnimationFinished &&
        <Header withShadow dynamic hide={this.props.course.selectedCourse} />}
        {this.props.course.selectedCourse
          ? <CourseHeader isExitAnimationFinished={isExitAnimationFinished} style={{ position: 'absolute' }}
            closeCourse={this.closeCourse}>
            <CourseProgressBar />
          </CourseHeader> : <View style={style.courseHeader} />}

        {!isExitAnimationFinished && <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Animatable.View ref='courseSelectorTitle'>
            <Text
              style={[styles.textDefault, {
                marginBottom: 5,
                fontSize: 24,
                fontFamily: 'Kalam-Regular',
                marginTop: '10%'
              }]}>
              Choose a course:
            </Text>
          </Animatable.View>
          {!this.props.courses.loading &&
          <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {this.props.courses.Courses.map(course => {
              const courseLogo = courseLogos[course.name]
              const onPressAction = course.isDisabled ? () => {} : () => { this.selectCourse(course) }
              const courseSelectorDisabler = course.isDisabled ? () => {} : this.disableCourseSelector
              const courseColor = course.isDisabled ? 'transparent' : course.color
              const textOpacity = course.isDisabled ? 0.5 : 1

              return (
                <Animatable.View key={course._id} style={{ elevation: 100, width: '45%' }}
                  ref={`${course._id}courseSelector`}>
                  <View ref={`${course._id}courseSelectorContainer`}
                    onLayout={() => {}} >
                    <CircleButton
                      courseName={course.name}
                      color={courseColor}
                      onPress={onPressAction}
                      disableCourseSelector={courseSelectorDisabler}
                      courseSelectorIsDisabled={this.state.courseSelectorIsDisabled}
                      isDisabled={course.isDisabled}
                    >
                      <Image
                        source={courseLogo.file}
                        style={{ width: courseLogo.width, height: courseLogo.height, alignSelf: 'center' }}
                      />
                    </CircleButton>
                  </View>
                  <View style={{
                    marginBottom: 20
                  }}>
                    <Animatable.Text style={[style.courseTitle, { opacity: textOpacity }]}
                      ref={`${course._id}courseSelectorText`}
                    >
                      {course.name}
                    </Animatable.Text>
                  </View>

                </Animatable.View>
              )
            })}
          </View>
          }

        </View>}

        {isExitAnimationFinished && <Course closeCourse={this.closeCourse} />}

        {this.props.mainMenu.visible && <MainMenu closeCourse={this.closeCourse} logoutAction={this.logoutAction} />}
      </View>
    )
  }
}

export default compose(
  connect(state => state),
  getGraphqlForLogInWithTokenMutation(graphql),
  getGraphqlForLogInWithFacebookAccessToken(graphql),
  getGraphqlForSelectCourseSaveTokenMutation(graphql),
  getGraphqlForCloseCourseMutation(graphql),
  graphql(currentUserQuery, { name: 'currentUser' }),
  graphql(coursesQuery, { name: 'courses' }),
  graphql(userDetailsQuery, { name: 'userDetails' })
)(WithData(Home, ['currentUser', 'courses', 'userDetails']))

const style = StyleSheet.create({
  courseTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16

  },
  smallCircle: {
    position: 'absolute',
    top: 0,
    left: 58,
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10
  },
  courseHeader: {
    margin: 0,
    height: appStyle.header.height,
    width: '100%'
  }
})
