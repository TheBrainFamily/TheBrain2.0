import React from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import { withRouter } from 'react-router'

import Header from './Header'

import styles from '../styles/styles'

class Home extends React.Component {
  openCourse = () => {
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
            <TouchableWithoutFeedback onPress={this.openCourse}>
              <View style={{
                marginHorizontal: 20
              }}>
                <View style={{
                  position: 'relative',
                  backgroundColor: '#662d91',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 2,
                  borderColor: 'white'
                }}>
                  <View style={[style.smallCircle]}/>
                  <View style={[style.smallCircle, { left: 116, top: 58 }]}/>
                  <View style={[style.smallCircle, { top: 116 }]}/>
                  <View style={[style.smallCircle, { left: 0, top: 58 }]}/>
                </View>
                <Text style={{
                  color: 'white',
                  marginTop: 15,
                  textAlign: 'center',
                  fontWeight: '500'
                }}>Chemistry</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{
              marginHorizontal: 20
            }}>
              <View style={{
                backgroundColor: '#53bd25',
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: 'white'
              }} />
              <Text style={{
                color: 'white',
                marginTop: 15,
                textAlign: 'center',
                fontWeight: '500'
              }}>Biology</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default withRouter(Home)

const style = StyleSheet.create({
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
