import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'

class Lectures extends React.Component {
  render () {
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text='LECTURES LIST' />
      </View>
    )
  }
}

export default connect()(Lectures)
