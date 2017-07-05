// @flow

import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { compose } from 'react-apollo'
import { connect } from 'react-redux'

import CourseHeader from './CourseHeader'

import styles from '../styles/styles'

class Congratulations extends React.Component {
  continue = () => {
    this.props.history.push('/')
  }

  render () {
    return (
      <View style={{
        position: 'relative',
        height: '100%',
        backgroundColor: '#6905ea'
      }}>
        <CourseHeader height={80} />

        <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={[styles.textDefault, { fontSize: 26 }]}>
            Congratulations
          </Text>
          <Text style={[styles.textDefault, { fontSize: 26, lineHeight: 36 }]}>
            Michał!
          </Text>
          <Image
            style={{ width: '30%', height: '40%', alignSelf: 'center', marginVertical: 10 }}
            source={require('../images/BillyBaby.png')}
          />
          <Text style={[styles.textDefault, { fontSize: 12 }]}>
            You've just became
          </Text>
          <Text style={[styles.textDefault, { fontSize: 26 }]}>
            Billy Baby!
          </Text>


          <TouchableOpacity onPress={this.continue}>
            <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 20, paddingHorizontal: 50 }]}>
              Continue learning Baby!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default compose(
  connect(),
)(Congratulations)
