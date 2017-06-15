import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { withRouter } from 'react-router'

import Header from './Header'
import CircleButton from './CircleButton'

import styles from '../styles/styles'

class Home extends React.Component {
  openCourse = (courseName) => () => {
    this.props.history.push('/course')
  }

  render () {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Header withShadow />

        <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#9050ba'
        }}>
          <Text
            style={[styles.textDefault, {
              marginBottom: 20,
              fontSize: 20
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
              <Text style={ style.courseTitle }>Chemistry</Text>
            </View>
            <View style={{
              marginHorizontal: 20
            }}>
              <CircleButton
                color="#62c46c"
                onPress={this.openCourse('Biology')}
              />
              <Text style={ style.courseTitle }>Biology</Text>
            </View>
          </View>
        </View>
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
    fontWeight: '500'
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
