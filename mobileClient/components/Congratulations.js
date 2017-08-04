// @flow

import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { compose } from 'react-apollo'
import { connect } from 'react-redux'

import PageContainer from './PageContainer'

import styles from '../styles/styles'

class Congratulations extends React.Component {
  continue = () => {
    this.props.history.push('/')
  }

  render () {
    return (
      <PageContainer>
        <View style={{ backgroundColor: '#6905ea', height: '100%', paddingTop: 10 }}>
          <Text style={[styles.textDefault, { fontSize: 26 }]}>
            Congratulations
          </Text>
          <Text style={[styles.textDefault, { fontSize: 26, lineHeight: 36 }]}>
            Michał!
          </Text>
          <View style={{ width: '100%', height: '35%', marginVertical: 10 }}>
            <Image
              style={{ width: '25%', height: '100%', alignSelf: 'center' }}
              source={require('../images/TB_level2.png')}
            />
          </View>
          <Text style={[styles.textDefault, { fontSize: 12 }]}>
            You've just became
          </Text>
          <Text style={[styles.textDefault, { fontSize: 26 }]}>
            Billy Baby!
          </Text>


          <TouchableOpacity onPress={this.continue}>
            <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 10, marginHorizontal: 10, paddingHorizontal: 50 }]}>
              Continue learning Baby!
            </Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    )
  }
}

export default compose(
  connect(),
)(Congratulations)
