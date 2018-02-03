import React from 'react'
import levelConfig from 'thebrain-shared/helpers/levelConfig'
import styles from '../../../styles/styles'
import { Image, Text, View } from 'react-native'

export default class MainMenuHeader extends React.Component {
  renderStats = (label, doneCount, totalCount, backgroundColor) => (
    <View style={{width: '50%', padding: 10, alignItems: 'center'}}>
      <Text style={style.text}>{label}</Text>
      <Text style={style.textBold}>{doneCount}/{totalCount}</Text>
      <View style={[style.card, {backgroundColor}]} />
    </View>
  )

  render () {
    const {level, currentUser, username, sessionCount} = this.props

    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        width: '100%',
        height: '33%',
        backgroundColor: 'white'
      }}>
        <Image
          style={{width: '25%', height: '85%', marginLeft: 20, resizeMode: 'contain'}}
          source={levelConfig[level].file}
        />
        {currentUser &&
        <View style={{
          width: '70%',
          padding: 20
        }}>
          <Text style={[styles.textDefault, {fontSize: 26, color: '#6905ea'}]}>
            {username}
          </Text>
          <View style={{width: '100%', marginTop: 5, flexDirection: 'row'}}>
            {this.renderStats('DUE', sessionCount.dueDone, sessionCount.dueTotal, '#4ba695')}
            <View style={{position: 'relative', width: 1, backgroundColor: '#999', elevation: 1000}}>
              <View style={{
                position: 'absolute',
                top: -4,
                left: -4,
                width: 8,
                height: 8,
                borderRadius: 8,
                backgroundColor: '#999'
              }} />
              <View style={{
                position: 'absolute',
                bottom: -4,
                left: -4,
                width: 8,
                height: 8,
                borderRadius: 8,
                backgroundColor: '#999'
              }} />
            </View>
            {this.renderStats('REVIEW', sessionCount.reviewDone, sessionCount.reviewTotal, '#c64f34')}
          </View>
        </View>
        }
      </View>
    )
  }
}

const style = {
  text: {
    color: '#999',
    fontFamily: 'Exo2-Regular'
  },
  textBold: {
    color: '#999',

    fontSize: 18
  },
  card: {
    width: 20,
    height: 14,
    marginTop: 8
  }
}
