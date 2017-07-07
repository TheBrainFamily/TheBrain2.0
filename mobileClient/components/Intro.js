import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import Video from './Video'

import styles from '../styles/styles'

class Intro extends React.Component {
  constructor (props) {
    super(props)
  }

  skipIntro = () => {
    this.props.history.push('/')
  }

  render () {
    return (
      <View style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#662d91'
      }}>
        <Header withShadow dynamic/>

        <View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={styles.textDefault}>
            Remember for life, not for exams.
          </Text>
          <Text style={styles.textDefault}>
            Learn smart and save your time.
          </Text>

          <View style={{ marginVertical: 30, width: '100%' }}>
            <Video height={200} videoId={'vvYTsbp2CRw'}/>
          </View>

          <TouchableOpacity onPress={this.skipIntro}>
            <Text style={[styles.button, { backgroundColor: '#68b888', paddingHorizontal: 50 }]}>
              Skip intro and start learning
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default connect()(Intro)
