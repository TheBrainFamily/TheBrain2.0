import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'

class Calendar extends React.Component {
  render () {
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text='REVIEWS CALENDAR' />
      </View>
    )
  }
}

export default connect()(Calendar)
