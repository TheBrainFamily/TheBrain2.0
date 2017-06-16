import React from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
import { withRouter } from 'react-router'

import Header from './Header'
import CircleButton from './CircleButton'
import Course from './Course'

import styles from '../styles/styles'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isCourseSelected: false
    }
  }

  openCourse = (courseName) => () => {
    this.setState({ isCourseSelected: true })
  }

  render () {
    const { isCourseSelected } = this.state

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Header withShadow hide={isCourseSelected} />

        {!isCourseSelected ?
          <View style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: !this.state.isCourseSelected ? '#9050ba' : 'transparent'
          }}>
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
          </View>
          :
          <Course />
        }
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
