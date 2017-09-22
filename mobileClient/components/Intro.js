import React from 'react'
import { AsyncStorage, Text, TouchableOpacity, View, BackHandler } from 'react-native'
import PageContainer from './PageContainer'
import Video from './Video'

import styles from '../styles/styles'

export default class Intro extends React.Component {
  componentDidMount = () => {
    if(BackHandler) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp()
      })
    }
  }

  componentWillUnmount = () => {
    if(BackHandler) {
      BackHandler.removeEventListener('hardwareBackPress')
    }
  }

  skipIntro = () => {
    const isIntroDisabled = JSON.stringify(true)
    AsyncStorage.setItem('isIntroDisabled', isIntroDisabled, () => {
      this.props.history.push('/')
    })
  }

  render () {
    const videoHeight = 200

    return (
      <PageContainer dontUseKeyboarAware={true}>
        <View style={{
          flex: 1,
          backgroundColor: '#9050ba',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={styles.textDefault}>
            Remember for life, not for exams.
          </Text>
          <Text style={styles.textDefault}>
            Learn smart and save your time.
          </Text>

          <View style={{ marginVertical: 30, height: videoHeight, width: '100%' }}>
            <Video height={videoHeight} videoId={'vvYTsbp2CRw'}/>
          </View>

          <TouchableOpacity onPress={this.skipIntro}>
            <Text style={[styles.button, { backgroundColor: '#68b888', paddingHorizontal: 40, marginHorizontal: 20 }]}>
              Skip intro and start learning
            </Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    )
  }
}
