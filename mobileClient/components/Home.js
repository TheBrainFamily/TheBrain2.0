import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { withRouter } from 'react-router'
import * as Animatable from 'react-native-animatable'

import Header from './Header'
import CircleButton from './CircleButton'
import CourseHeader from './CourseHeader'
import Course from './Course'

import styles from '../styles/styles'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isCourseSelected: false,
      isExitAnimationFinished: false
    }
  }

  openCourse = (courseName) => () => {
    this.setState({ isCourseSelected: true })
    this.refs.courseSelector.fadeOut(1000).then(() => this.setState({ isExitAnimationFinished: true }))
  }

  closeCourse = () => {
    this.setState({ isCourseSelected: false, isExitAnimationFinished: false })
  }

  render () {
    const { isCourseSelected, isExitAnimationFinished } = this.state

    return (
      <View style={{ position: 'relative', width: '100%', height: '100%' }}>
        {!isExitAnimationFinished && <Header withShadow hide={isCourseSelected} />}
        {isCourseSelected && <CourseHeader style={{ position: 'absolute' }} onLogoPress={this.closeCourse} />}

        {!isExitAnimationFinished && <Animatable.View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: !this.state.isCourseSelected ? '#9050ba' : 'transparent'
        }} ref="courseSelector">
          <Text
            style={[styles.textDefault, {
              marginBottom: 30,
              fontSize: 20,
              fontFamily: 'Exo2-Bold'
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
              />
              <Text style={style.courseTitle}>Chemistry</Text>
            </View>
            <View style={{
              marginHorizontal: 20
            }}>
              <CircleButton
                color="#62c46c"
                onPress={this.openCourse('Biology')}
              />
              <Text style={style.courseTitle}>Biology</Text>
            </View>
          </View>
        </Animatable.View>}

        {isExitAnimationFinished && <Course />}
      </View>
    )
  }
}

export default withRouter(Home)

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
