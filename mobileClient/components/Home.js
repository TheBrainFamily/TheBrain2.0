import _ from 'lodash'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, InteractionManager, Dimensions } from 'react-native'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'
import Header from './Header'
import CircleButton from './CircleButton'
import CourseHeader from './CourseHeader'
import CourseProgressBar from './CourseProgressBar'
import Course from './Course'

import * as courseActions from '../actions/CourseActions'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'
import courseLogos from '../helpers/courseLogos'

import coursesQuery from '../../client/shared/graphql/queries/courses'

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
      const elementHeightChangeAfterScaling = (height - newSizeY) / 2
      const translateYValue = this.height - pageYOffset - desiredElementTopYOffset - elementHeightChangeAfterScaling

      const newSizeX = width * scale
      const centeredLeftXOffset = (this.width - newSizeX) / 2
      const elementWidthChangeAfterScaling = (width - newSizeX) / 2
      const translateXValue = centeredLeftXOffset - pageXOffset - elementWidthChangeAfterScaling

      // this.refs[`${selectedCourseId}courseSelector`].transitionTo({transform: [{translateX: translateXValue}, {translateY: translateYValue}, {scale}]}, 2000)
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
    this.setState({ isCourseSelected: false, isExitAnimationFinished: false })
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
        {!isExitAnimationFinished && <Header withShadow dynamic hide={isCourseSelected}/>}
        {isCourseSelected ? <CourseHeader style={{ position: 'absolute' }} closeCourse={this.closeCourse}
                                          toggleMainMenu={this.toggleMainMenu}>
          <CourseProgressBar />
        </CourseHeader> : <View style={style.courseHeader}/>}

        {!isExitAnimationFinished && <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Animatable.View ref='courseSelectorTitle'>
            <Text
              style={[styles.textDefault, {
                marginBottom: 30,
                fontSize: 24,
                fontFamily: 'Kalam-Regular'
              }]}>
              Choose a course:
            </Text>
          </Animatable.View>
          {!this.props.courses.loading &&
          <View style={{ flexDirection: 'row' }}>
            {this.props.courses.Courses.map(course => {
              const courseLogo = courseLogos[course.name]
              const logoSize = courseLogo.scale * 80
              return (
                <View key={course._id} style={{
                  marginHorizontal: '2%',
                }}>
                  <View ref={`${course._id}courseSelectorContainer`}>
                    <Animatable.View style={{ zIndex: 100 }}
                                     ref={`${course._id}courseSelector`}>
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
                    </Animatable.View>
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
                </View>
              )
            })}
          </View>
          }

        </View>}

        {isExitAnimationFinished && <Course mainMenuActive={this.state.mainMenuActive}/>}
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
  graphql(coursesQuery, { name: 'courses' })
)(Home)

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
    // zIndex: 500,
    margin: 0,
    height: appStyle.header.height,
    width: '100%',
  }
})
