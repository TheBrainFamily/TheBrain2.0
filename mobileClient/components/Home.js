import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View } from 'react-native'
import { withRouter } from 'react-router'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'
import Header from './Header'
import CircleButton from './CircleButton'
import CourseHeader from './CourseHeader'
import CourseProgressBar from './CourseProgressBar'
import Course from './Course'

import * as courseActions from '../actions/CourseActions'

import styles from '../styles/styles'

class Home extends React.Component {
  constructor (props) {
    super(props)
    const isCourseSelected = !!props.course.selectedCourse || false
    this.state = {
      isCourseSelected,
      isExitAnimationFinished: isCourseSelected
    }
  }

  openCourse = (courseName) => () => {
    this.props.dispatch(courseActions.open(courseName))
    this.setState({ isCourseSelected: true })
    this.refs.courseSelector.fadeOut(1000).then(() => this.setState({ isExitAnimationFinished: true }))
  }

  closeCourse = () => {
    this.props.dispatch(courseActions.close())
    this.setState({ isCourseSelected: false, isExitAnimationFinished: false })
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
        {!isExitAnimationFinished && <Header withShadow dynamic hide={isCourseSelected} />}
        {isCourseSelected &&
          <CourseHeader style={{ position: 'absolute' }} onLogoPress={this.closeCourse}>
            <CourseProgressBar />
          </CourseHeader>
        }

        {!isExitAnimationFinished && <Animatable.View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }} ref="courseSelector">
          <Text
            style={[styles.textDefault, {
              marginBottom: 30,
              fontSize: 24,
              fontFamily: 'Kalam-Regular'
            }]}>
            Choose a course:
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{
              marginHorizontal: 20
            }}>
              <CircleButton
                color="#662d91"
                onPress={this.openCourse('Chemistry')}
              >
                <SvgUri
                  width="80"
                  height="80"
                  source={require('../images/chemistry.svg')}
                  style={{ width: 80, height: 80, alignSelf: 'center' }}
                />
              </CircleButton>
              <Text style={style.courseTitle}>Chemistry</Text>
            </View>
            <View style={{
              marginHorizontal: 20
            }}>
              <CircleButton
                color="#62c46c"
                onPress={this.openCourse('Biology')}
              >
                <SvgUri
                  width="60"
                  height="60"
                  source={require('../images/biology.svg')}
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                />
              </CircleButton>
              <Text style={style.courseTitle}>Biology</Text>
            </View>
          </View>
        </Animatable.View>}

        {isExitAnimationFinished && <Course />}
      </View>
    )
  }
}

export default connect(state => state)(Home)

const style = StyleSheet.create({
  courseTitle: {
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Exo2-Regular'
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
  }
})
