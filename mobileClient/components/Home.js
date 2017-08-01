import _ from 'lodash'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, InteractionManager, Dimensions, Platform } from 'react-native'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'

import Header from './Header'
import CircleButton from './CircleButton'
import CourseHeader from './CourseHeader'
import CourseProgressBar from './CourseProgressBar'
import Course from './Course'
import MainMenu from './MainMenu'

import * as courseActions from '../actions/CourseActions'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'
import courseLogos from '../helpers/courseLogos'

import coursesQuery from '../../client/shared/graphql/queries/courses'
import WithData from './WithData'

class Home extends React.Component {
  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.height = height
    this.width = width
    const isCourseSelected = !!props.course.selectedCourse || false
    this.state = {
      isCourseSelected,
      isExitAnimationFinished: isCourseSelected,
      courseSelectorIsDisabled: false,
      mainMenuActive: false
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   if (!nextProps.userDetails || nextProps.userDetails.loading || nextProps.userDetails.error || !nextProps.courses ||
  //     nextProps.courses.loading) {
  //     return
  //   }
  //
  //   const courseId = nextProps.userDetails.UserDetails.selectedCourse
  //
  //   if (!courseId) {
  //     return
  //   }
  //
  //   const course = nextProps.courses.Courses.find((course) => course._id === courseId)
  //   this.props.dispatch(courseActions.select(course))
  //   this.setState({ isCourseSelected: true, isExitAnimationFinished: true })
  // }

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
    this.refs[`${selectedCourseId}courseSelectorContainer`].measure((fx, fy, width, height, pageXOffset, pageYOffset) => {
      const scale = 0.75
      const desiredBottomYOffset = 25
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

      if (Platform.OS === 'ios') {
        this.refs[`${selectedCourseId}courseSelector`].transitionTo({ transform: [{ translateX: translateXValue }, { translateY: translateYValue }, { scale }] }, 2000)
      } else {
        this.refs[`${selectedCourseId}courseSelector`].bounceOut(1000)
      }

      this.animateCourseSelectorsFadeOut(selectedCourseId)
    })
  }

  selectCourse = (course) => async () => {
    if (!this.state.isCourseSelected) {
      this.setState({ isCourseSelected: true })
      this.props.dispatch(courseActions.select(course))
      await this.props.selectCourse({ courseId: course._id })

      this.animateCourseSelector(course._id)
    }
  }

  disableCourseSelector = () => {
    this.setState({ courseSelectorIsDisabled: true })
  }
  enableCourseSelector = () => {
    this.setState({ courseSelectorIsDisabled: false })
  }

  closeCourse = () => {
    this.props.dispatch(courseActions.close())
    this.setState({ isCourseSelected: false, isExitAnimationFinished: false, mainMenuActive: false })
    this.enableCourseSelector()
  }

  toggleMainMenu = () => {
    this.setState({ mainMenuActive: !this.state.mainMenuActive })
  }

  render () {
    const { isCourseSelected, isExitAnimationFinished } = this.state
    const { course } = this.props
    const courseColor = _.get(course, 'selectedCourse.color')

    return (
      <View style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: courseColor
      }}>
        {!isExitAnimationFinished && <Header withShadow dynamic hide={isCourseSelected} toggleMainMenu={this.toggleMainMenu}/>}
        {isCourseSelected ? <CourseHeader style={{ position: 'absolute' }} closeCourse={this.closeCourse}
                                          toggleMainMenu={this.toggleMainMenu}>
          <CourseProgressBar />
        </CourseHeader> : <View style={style.courseHeader}/>}

        {!isExitAnimationFinished && <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Animatable.View ref='courseSelectorTitle'>
            <Text
              style={[styles.textDefault, {
                marginBottom: 30,
                fontSize: 24,
                fontFamily: 'Kalam-Regular',
                marginTop: '20%'
              }]}>
              Choose a course:
            </Text>
          </Animatable.View>
          {!this.props.courses.loading &&
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {this.props.courses.Courses.map(course => {
              const courseLogo = courseLogos[course.name]
              const logoSize = courseLogo.scale * 80
              return (
                <Animatable.View key={course._id} style={{ zIndex: 100, marginHorizontal: '2%' }}
                                 ref={`${course._id}courseSelector`}>
                  <View ref={`${course._id}courseSelectorContainer`}
                        onLayout={() => {}}>
                    <CircleButton
                      color={course.color}
                      onPress={this.selectCourse(course)}
                      disableCourseSelector={this.disableCourseSelector}
                      courseSelectorIsDisabled={this.state.courseSelectorIsDisabled}
                    >
                      <SvgUri
                        width={logoSize}
                        height={logoSize}
                        source={courseLogo.file}
                        style={{ width: logoSize, height: logoSize, alignSelf: 'center' }}
                      />
                    </CircleButton>
                  </View>
                  <View style={{
                    marginHorizontal: 20
                  }}>
                    <Animatable.Text style={style.courseTitle}
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

        {isExitAnimationFinished && <Course />}

        {this.state.mainMenuActive && <MainMenu closeCourse={this.closeCourse} toggleMainMenu={this.toggleMainMenu}/>}
      </View>
    )
  }
}

const selectCourseMutation = gql`
    mutation selectCourse($courseId: String!) {
        selectCourse(courseId: $courseId) {
            success
        }
    }
`

const userDetailsQuery = gql`
    query UserDetails {
        UserDetails {
            selectedCourse
        }
    }
`

export default compose(
  connect(state => state),
  graphql(selectCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      selectCourse: ({ courseId }) => mutate({
        variables: {
          courseId
        }
      })
    })
  }),
  graphql(coursesQuery, { name: 'courses' }),
  graphql(userDetailsQuery, { name: 'userDetails' })
)(WithData(Home, ['courses', 'userDetails']))

const style = StyleSheet.create({
  courseTitle: {
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Exo2-Bold'
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
    width: '100%',
  }
})
