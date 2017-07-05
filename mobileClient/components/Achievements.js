import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'

import styles from '../styles/styles'

class Achievements extends React.Component {
  render () {
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text='ACHIEVEMENTS LIST' />
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          height: '100%',
          padding: 20
        }}>
          <View style={{ width: '50%', padding: 30 }}>
            <Image
              style={{ width: '100%', height: 220 }}
              source={require('../images/BillyBaby.png')}
            />
            <Text style={[styles.textDefault, { color: '#6905ea' }]}>Billy Baby</Text>
          </View>
          <View style={{ width: '50%', padding: 30 }}>
            <Image
              style={{ width: 120, height: 220 }}
              source={require('../images/BillyBaby.png')}
            />
            <Text style={[styles.textDefault, { color: '#6905ea' }]}>Billy Junior</Text>
          </View>
          <View style={{ width: '50%', padding: 30 }}>
            <Image
              style={{ width: 120, height: 220 }}
              source={require('../images/BillyBaby.png')}
            />
            <Text style={[styles.textDefault, { color: '#6905ea' }]}>Billy Teen</Text>
          </View>
          <View style={{ width: '50%', padding: 30 }}>
            <Image
              style={{ width: 120, height: 220 }}
              source={require('../images/BillyBaby.png')}
            />
            <Text style={[styles.textDefault, { color: '#6905ea' }]}>Big Billy</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default connect()(Achievements)
