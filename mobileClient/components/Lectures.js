import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'
import { LectureVideoWithRouter } from './Lecture'

class Lectures extends React.Component {
  render () {
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text='LECTURES LIST' />
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          height: '100%',
          padding: 10
        }}>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
          <View style={{ width: '50%', padding: 10 }}>
            <LectureVideoWithRouter lesson={{}} height={100} />
            <Text style={style.title}>"Very long lecture title"</Text>
          </View>
        </View>
      </View>
    )
  }
}

const style = {
  title: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    textAlign: 'center'
  }
}

export default connect()(Lectures)
